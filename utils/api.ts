import { GAS_WEB_APP_URL } from '../constants';
import { PlacedOrnament, OrnamentDesign, RankingItem, Comment, PostListItem } from '../types';

// Helper to separate real message from metadata in content string
// Format: "Real Message...|||JSON_METADATA"
const METADATA_SEPARATOR = "|||";

export async function fetchOrnamentsFromSheet(): Promise<PlacedOrnament[]> {
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPostList`, {
      method: 'GET',
    });
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const parsedOrnaments: PlacedOrnament[] = [];

      result.data.forEach((post: any) => {
        // Only process posts that have our metadata
        if (post.Content && post.Content.includes(METADATA_SEPARATOR)) {
          const parts = post.Content.split(METADATA_SEPARATOR);
          const message = parts[0];
          try {
            const metadata = JSON.parse(parts[1]);
            
            // Check if metadata has valid coordinate info
            if (metadata.x !== undefined && metadata.y !== undefined) {
              parsedOrnaments.push({
                id: post.ID || Math.random().toString(),
                userId: post.Name, // Using Name as ID proxy
                userName: post.Name,
                affiliation: post.Affiliation,
                design: metadata.design as OrnamentDesign,
                panelIndex: metadata.panelIndex,
                slotIndex: metadata.slotIndex,
                x: metadata.x,
                y: metadata.y,
                message: message
              });
            }
          } catch (e) {
            console.warn("Failed to parse ornament metadata for post", post.ID);
          }
        }
      });
      return parsedOrnaments;
    }
    return [];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}

export async function saveOrnamentToSheet(
  userData: any, 
  design: OrnamentDesign, 
  panelIndex: number, 
  slotIndex: number,
  x: number, 
  y: number
): Promise<boolean> {
  
  const metadata = {
    design: design,
    panelIndex: panelIndex,
    slotIndex: slotIndex,
    x: x,
    y: y
  };

  // Append metadata to content so it persists
  const contentWithMetadata = `${userData.content}${METADATA_SEPARATOR}${JSON.stringify(metadata)}`;

  const payload = {
    action: 'savePost',
    name: userData.name,
    affiliation: userData.affiliation,
    interests: userData.interests.join(', '), // API expects string
    postType: userData.theme,
    title: userData.title,
    content: contentWithMetadata 
  };

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("API Save Error:", error);
    return false;
  }
}

// === New Functions for Ranking and Comments ===

export async function getInterestRanking(affiliation: string): Promise<RankingItem[]> {
  try {
    const params = new URLSearchParams({ 
      action: 'getInterestRanking', 
      data: JSON.stringify({ affiliation }) 
    });
    const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, { method: 'GET' });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Ranking Fetch Error:", error);
    return [];
  }
}

export async function getPostList(): Promise<PostListItem[]> {
  try {
    const response = await fetch(`${GAS_WEB_APP_URL}?action=getPostList`, { method: 'GET' });
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
        // We need to clean the content if it contains metadata
        return result.data.map((item: PostListItem) => {
            const content = item.Content.includes(METADATA_SEPARATOR) 
                ? item.Content.split(METADATA_SEPARATOR)[0] 
                : item.Content;
            return { ...item, Content: content };
        });
    }
    return [];
  } catch (error) {
    console.error("Post List Fetch Error:", error);
    return [];
  }
}

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const params = new URLSearchParams({ 
      action: 'getComments', 
      data: JSON.stringify({ postId }) 
    });
    const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, { method: 'GET' });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Comments Fetch Error:", error);
    return [];
  }
}

export async function saveComment(postId: string, commenterName: string, affiliation: string, commentContent: string): Promise<{ success: boolean; message?: string }> {
  try {
    const payload = {
      action: 'saveComment',
      postId,
      commenterName,
      affiliation,
      commentContent
    };
    const response = await fetch(GAS_WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Save Comment Error:", error);
    return { success: false, message: "Network Error" };
  }
}