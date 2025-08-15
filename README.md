# Salesforce: How to Add Sound to Liven Up the Interface
A person has 5 senses:</br>

* Sight
* Hearing
* Smell
* Touch
* Taste

Each of these senses is important in its own way and corresponds to a specific sphere of perception. It’s no wonder that from a young age we are drawn to things that are beautiful and bright; when it comes to food, we are attracted to tastes that are delicious and aromas that are pleasant.

Hearing is a particularly special world where emotions intertwine with the way we perceive the world. In the forest, hearing birds sing brings us inner calm. As children, we fell asleep to our mother’s lullabies; as teenagers, we danced to our favorite tracks. And when we pet a cat or dog, we feel comfort and emotional relief.

Salesforce should also be visually appealing and user-friendly for those who work with it. For this, there are themes and the ability to create custom components that are not only functional but also look exactly as the client needs.

There are plenty of little touches that make the experience more enjoyable.

And one of these little touches is sounds 🎵

Out-of-the-box Salesforce sticks to its strict style, without extra details, and there are no sounds.

But admit it: it would be nice if certain actions were accompanied by subtle audio cues.

And such a possibility exists.

So, we'll need the Trailshred Player (ID: 04t1U000007sa55QAA), sound templates or your own audio files, and some system settings.

⚙️ Basic Logic
---
We select the object, field, and value that will trigger the desired sound.

This Trailhead-lesson includes a step-by-step guide and an archive of sound templates.

It covers an example where a specific audio file is played for an Opportunity with Stage = Closed Won.

In short:

1️⃣ Installing the Package

2️⃣ Adding an LWC Component to the Page of the Desired Object (the Component Is "Invisible", Does Not Interfere or Attract Attention).

3️⃣ Uploading an Audio File to Static Resources, Considering the Requirements:

Size ≤ 5 MB
Format: .mp3 or .wav
Duration: 5-10 seconds
The file must be publicly accessible for use

4️⃣ In Custom Metadata Types, specify the file, object, field, and value at which the music is played.

That's all the settings.

Result:
https://github.com/user-attachments/assets/0ddf614b-ed12-4a02-85a0-5d0e09ae48b0

Pretty good, and the whole setup literally takes about 15 minutes. This way, you can add a bit of "life" to our SF Org 🎶

🛑 Limitations I Encountered
---
Overall, the setup went smoothly: the sounds for changing the Stage in Opportunity are working.

I also tested similar functionality for field changes to specific values for Account and Contact.

However, there was one inconvenience: the system required a specific field value.

For example, I wanted one sound to play for any Stage change, and a different one for Closed Won.

In this case, I would have had to create a separate setting for each Stage (currently 8), all using the same sound, and a 9th setting for Closed Won.

💡 So I made minor changes to the base LWC code
If the field value is empty or null - the music plays on any field change.
If the field value is specified - only the selected audio plays.
If both a specific value and the "any value" setting exist - the specific value takes priority.

This allowed us to eliminate duplicate sounds and unnecessary settings. The changes affected only the component's JS file.

I have uploaded the updated code to GitHub

Final result:
https://github.com/user-attachments/assets/cfbde6bc-c0b7-49d4-b4ab-dbde19afe81e

Conclusion
---
Salesforce constantly amazes with its features and tools. Although there are many similar solutions on the AppExchange, this approach is free and simple. Most importantly, it allows you to make the user experience even more enjoyable and "alive".
