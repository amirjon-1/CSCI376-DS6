
document.addEventListener("click", async (e) => {
    const img = e.target;


    if(img.tagName.toLowerCase() !== "img") {
        return;
    };

    let thelink;
    if (img.tagName.toLowerCase() === "a") {
        thelink = img;
    }else{
        thelink = img.closest("a");
    }
    if (thelink){
        e.preventDefault(); //Stops the link from opening so it doesnt mess with the extension
        //instead we will open it up on another tab and stay on the current one.
        if (thelink.href){
            thelink = thelink.href
            window.open(thelink, "_blank"); 
        }
    }


     console.log(e.target.src);
 
     const imgSrc = img.src;
 
     //this is not wise to put api key here but it doesn't have any unsafe permissions so it is ok
     const apikey = "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"
 
 
     //used groq api documentation for these parameters. 
     const bodyinfo = {
         model: "meta-llama/llama-4-scout-17b-16e-instruct",
         messages: [
             {
                 role: "user",
                 content: [
                     {
                       "type": "text",
                       "text": "Generate a concise, one-sentence description of the image, identifying any famous scenes, artworks, or iconic moments (if there are any) while capturing the key elements and context."
                     },
                     {
                       "type": "image_url",
                       "image_url": {
                         "url": imgSrc
                       }
                     }
                   ]
             },
         ],
         temperature: 1,
     };
 
     const headers = {
         "Authorization": `Bearer ${apikey}`,
         "Content-Type": "application/json",
     };

     showPopup("Description is being generated");

 
     try {

         const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
             method: "POST",
             headers: headers,
             body: JSON.stringify(bodyinfo),
         });
 
         if (!response.ok) {
             throw new Error(`Error: ${response.status}`);
         }
 
         const data = await response.json();
         const dec = data.choices?.[0]?.message?.content;
 
        //  alert(`The description of the image is : ${dec}`);
        closePopup();
        showPopup(dec);

     } catch (error) {
         console.error("There has been an error: ", error);
        //  alert("There has been a error. Check console for details");
        closePopup();
         showPopup("There has been a error. Check console for details");

     }
 
 });




 function showPopup(msg) {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <div class="popup-content">
            <span class="close">&times;</span>
            <h3>The Image Description: </h3>
            <p>${msg}</p>
        </div>
    `;
    document.body.appendChild(popup);

    const css = `
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            width: 80%;
            max-width: 400px;
            padding: 1rem;
            text-align: center;
        }
        .popup-content {
            position: relative;
        }
        .popup h3 {
            font-size: 1.5rem;
            color: black;
        }
        .popup p {
            font-size: 1rem;
            color: black;
            margin: 0.5rem;
        }
        .close {
            cursor: pointer;
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 1.8rem;
            font-weight: bold;
            color: black;
        }`;
    //this adds inline css in the html and adds it to the head
    const styl = document.createElement("style");
    styl.textContent = css;
    document.head.appendChild(styl);

    popup.querySelector(".close").addEventListener("click", () => popup.remove());
}

function closePopup() {
    const popup = document.querySelector(".popup");
    if (popup) {
        popup.remove();
    }
}
