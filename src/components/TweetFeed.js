import React, {useEffect, useState,} from 'react';
import {getNewTweetCount, getNewTweets, getOldTweets, getTweets} from "../Api/ApiCalls";
import TweetView from "./TweetView";
import {useApiProgress} from "../Shared/ApiProgress";
import Spiner from "./Spiner";
import {useParams} from "react-router-dom"

const TweetFeed = () => {

    const [tweetPage, setTweetPage] = useState( {content: [], last: true} );
    const [newTweetCount, setNewTweetCount] = useState( 0 );
    const {username} = useParams();
    const path = username ? `/api/${username}/tweets?page=` : "/api/tweets?page=";
    const ınıtialTweetLoadProgress = useApiProgress( "get", path )

    let lastTweetId = 0
    let firsTweetId = 0;
    if (tweetPage.content.length > 0) {
        firsTweetId = tweetPage.content[0].id;
        const lastTweetIndex = tweetPage.content.length - 1;
        lastTweetId = tweetPage.content[lastTweetIndex].id;
    }
    const oldTweetPath = username ? `/api/${username}/tweets/${lastTweetId}` : "api/tweets/" + lastTweetId
    const loadOldTweetsProgress = useApiProgress( "get", oldTweetPath, true );

    const newTweetPath=username ? `/api/${username}/tweets/${firsTweetId}?direction=after`:`/api/tweets/${firsTweetId}?direction=after`;

    const loadNewTweetsProgress = useApiProgress( "get", newTweetPath, true );

    useEffect( () => {
        const getCount = async () => {
            const response = await getNewTweetCount( firsTweetId, username );
            setNewTweetCount( response.data.count );
        }
        let looper = setInterval( getCount,2500 );
        return function cleanUp() {
            clearInterval( looper );
        }

    }, [firsTweetId, username] )

    useEffect( () => {
        const loadTweet = async (page) => {
            try {
                const response = await getTweets( username, page );
                setTweetPage( prevState => ({
                    ...response.data,
                    content: [...prevState.content, ...response.data.content]
                }) ); // eski tweetler yükleninc arraye ekleme yapıyoruz
            } catch (error) {
            }
        }
        loadTweet();
    }, [username] )


    const loadOldTweets = async () => {
        try {
            const response = await getOldTweets( lastTweetId, username );
            setTweetPage( prevState => ({
                ...response.data,
                content: [...prevState.content, ...response.data.content]
            }) );

        } catch (e) {
        }
    }

    const loadNewTweets=async ()=>{
        const response=await getNewTweets(firsTweetId,username);
        setTweetPage( prevState => ({
            ...prevState,
            content: [...response.data,...prevState.content]
        }) );
        setNewTweetCount(0);

    }

    const onDeleteTweetSucces =(id)=>{
        setTweetPage(prevState => ({
            ...prevState,
            content: prevState.content.filter((tweet)=>tweet.id!==id)
        }))
    }

    const {content, last} = tweetPage;

    if (content.length === 0) {
        return <div className="alert alert-secondary text-center">{ınıtialTweetLoadProgress ?
            <Spiner/> : 'Load old tweets'}</div>
    }

    return (
        <div>
            {newTweetCount > 0 &&
            <div
                className="alert alert-secondary text-center mb-1"
                onClick={loadNewTweetsProgress ? () => {} : loadNewTweets}
                style={{cursor: loadNewTweetsProgress ? "not-allowed" : "pointer"}}>
                {loadNewTweetsProgress ?<Spiner/> :"There are new tweets "+newTweetCount}
            </div>
            }
            {content.map( tweet => {
                return <TweetView key={tweet.id} tweet={tweet} onDeleteTweet={onDeleteTweetSucces}/>
            } )}
            {!last && <div  className="alert alert-secondary text-center"
                onClick={loadOldTweetsProgress ? () => {
                } : loadOldTweets}
                style={{cursor: loadOldTweetsProgress ? "not-allowed" : "pointer"}}>
                {loadOldTweetsProgress ? <Spiner/> : "Load old tweets"}
            </div>}
        </div>
    );
};

export default TweetFeed;