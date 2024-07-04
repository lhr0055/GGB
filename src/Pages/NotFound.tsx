import React, { useEffect } from "react";

function NotFound () {
    const Gif = () => {
        useEffect(()=>{
            const script = document.createElement('script');
            script.src = "https://tenor.com/embed.js";
            script.async = true;
            document.body.appendChild(script);

            return()=>{
                document.body.removeChild(script);
            };
        },[]);
    }

    return(
        <div>NotFound
            <div className="tenor-gif-embed" 
            data-postid="6579236210756475270" 
            data-share-method="host" 
            data-aspect-ratio="1" 
            data-width="100%">
                <a href="https://tenor.com/view/travel-korea-penguin-asia-pudgy-gif-6579236210756475270">
                    Travel Korea GIF
                </a>
                    from 
                <a href="https://tenor.com/search/travel-gifs">
                    Travel GIFs
                </a>
            </div> 
            <script type="text/javascript" 
                async src="https://tenor.com/embed.js">
            </script>
        </div>
    )
}

export default NotFound;