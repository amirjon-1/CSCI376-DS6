require('dotenv').config();

document.addEventListener("click", async (e) => {
   const img = e.target;
   if(img.tagName.toLowerCase() !== "img") return;
    console.log(e.target.src);

    const imgSrc = img.src;
    const apikey = process.env.API_KEY;


    //used groq api documentation for these parameters. 
    const bodyinfo = {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
            {
                role: "user",
                content: [
                    {
                      "type": "text",
                      "text": "Give me a one sentence description of this image"
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

        alert(`The image description is : ${data.choices?.[0]?.message?.content}`);

    } catch (error) {
        console.error("There has been an error: ", error);
        alert("There has been a error. Check console for details");
    }

});

