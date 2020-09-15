import axios from "axios";

export const singUp = (addedUser) => {
    return axios.post( "/api/users", addedUser, {headers: {"accept-language": 'en'}} );
}

export const login = (creds) => {
    return axios.post( "/api/auth", {}, {auth: creds} )
};

export const getUsers = (page = 0, size = 3) => {
    return axios.get( `/api/users?page=${page}&size=${size}` );
};

export const setAuthorizationHeader = ({username, password, isLoggedIn}) => { // Login olan kullanıcının userlist de gözükmemesi için
    if (isLoggedIn) {
        const authorizationHeaderValue = `Basic ${btoa( username + ":" + password )}`; // base64 e çeviriyoruz;
        axios.defaults.headers['Authorization'] = authorizationHeaderValue;
    } else
        delete axios.defaults.headers['Authorization'];
};

export const getUser = username => {
    return axios.get( `/api/users/${username}` );
    //  return axios.get("/api/users/"+username);
}

export const updateUser=(username,updatedDisplayName)=>{
    return axios.put(`/api/users/${username}`,updatedDisplayName,{headers: {"accept-language": 'en'}});
}

export const postTweet=(tweet)=>{
    return axios.post("/api/tweets",tweet)

}

export const getTweets=(username,page)=>{
    const path=username ? `/api/${username}/tweets?page=`: "/api/tweets?page=";
    return axios.get(path+page);
}

export const getOldTweets=(id,username)=>{
    const path=username ? `/api/${username}/tweets/${id}`:"api/tweets/"+id
    return axios.get(path);
}

export const getNewTweetCount=(id,username)=>{
    const path=username ? `/api/${username}/tweets/${id}?count=true`: `/api/tweets/${id}?count=true`
    return axios.get(path);
}



export const getNewTweets=(id,username)=>{
    const path=username ? `/api/${username}/tweets/${id}?direction=after`:`/api/tweets/${id}?direction=after`
    return axios.get( path)
}

export const postTweetAttachment=(attachment)=>{
    return axios.post("/api/tweet-attachments",attachment);

}

export const deleteTweet=id=>{
    return axios.delete("/api/tweets/"+id)
}
export const deleteUser=()=>{
    return axios.delete("/api/users/");
}
