const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export async function apiRequest(path, options = {}){
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });
    
    let data = null;
    try{
        data = await response.json();
    } catch(err){
        // No JSON response
        data = null;
    }

    if(!response.ok){
        throw new Error(data?.message || 'API request failed');
    }

    return data;
}