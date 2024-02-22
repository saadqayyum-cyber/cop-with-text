import Image from "next/image";
import image1 from "../assets/1.jpg";
import image2 from "../assets/2.png";
import image3 from "../assets/3.png";
import image4 from "../assets/4.png";
import image5 from "../assets/5.png";
import image6 from "../assets/6.png";

function Home() {
  return (
    <div className="px-2 sm:px-6 md:px-10 lg:px-14 xl:px-24 py-28">
      <div className="bg-black flex flex-col justify-center items-start home p-12">
        <p className="pb-14">
          Cop With Text is a 3333 image collection with 2.5% royalties. I airdropped the first 40 to some random addresses.It is
          now a free mint to saga genesis holders, saga monke holders and little swag world holders.
          <br /> <br />I began the series Cop With Text 20 years ago when I witnessed a police officer looking at a Nokia brick
          while a crime was occurring. That night I went home and I imagined what must have been so important to create that
          distraction. That night I drew the image of the cop on the phone. For years I came back to this theme and made image
          after image of police officers looking at phones. Most of these images were drawings..Two years ago I came back to this
          series in earnest. I wanted to make an NFT collection of Cop With Text. I started searching “cop with cell phone” to
          find images to use as material. The prompts for Dalle-2 that I used were informed by years of searching, drawing and
          observing.
        </p>

        <Image src={image1} alt="image1" />
        <p className="py-14">
          I used Dalle-2 rather than Dalle-3 because it created images that I preferred. The images from Dalle-3 were crisp, rigid
          and always grid based. They did look cool and a bit like a bootleg Nintendo game from Canal Street. But these images
          were not what I was looking for. Dalle-2 gave me what I wanted: dynamic & interesting images that were just a little bit
          non conforming to the prompt. These images from Dalle-2 were pixel art, yet somehow more painterly and less rigid than
          Dalle-3. What some would call an error in prompt or output, I found to be the most interesting visual expression that
          was possible with the tools I sought to use.
        </p>
        <Image src={image2} alt="image2" />
        <p className="py-14">
          One of the rarest traits in this collection is the background “Uvaldalle”. Formerly, when searching for images I never
          quite knew what the search would yield. Usually it was shutter stock knock off images or a silly post from a random
          person who had taken a picture of a police officer looking at a phone. This all changed when I began searching for “cop
          with cell phone” in 2022.
        </p>
        <Image src={image3} alt="image3" />
        <p className="py-14">
          Suddenly the search query was dominated by the image of the Uvalde Police Officer looking at his phone during the
          shooting at Robb Elementary. I knew I had to include this image in the collection. This image of a police officer
          looking at a cell phone was now front and center. It dominates the search query and for a brief moment it dominated the
          public discourse. It took many tries to get Dalle to provide an image, as describing the exact image goes against the
          terms of use. I am most pleased with the perspective in the “Uvaldalle” images. The prompt included the concept that
          “the image is as if taken from above on a security camera”.
        </p>

        <Image src={image4} alt="image4" />
        <p className="py-14">
          The primary objective of Cop With Text is to promote the concept of Illumination as Solar Worship. One of the most
          primitive structures of human religion is the worshiping of the sun. With good reason humans put their faith in the
          consistency and power of our star: The Sun. I believe that all forms of illumination are solar worship. Torch, candle,
          lantern & light bulb all changed the way that we have lived as humans. The Amish believe they worship the Christian God
          but I believe they worship the Sun.
        </p>
        <Image src={image5} alt="image5" />
        <p className="py-14">
          The illumination we carry in our pocket can light our life and our mind. It tracks the key strokes of our desires and
          fears. It remembers and knows. It does what we always wanted others to do but couldn’t. It can understand and serve our
          desires. Some may explain Cop With Text as the intersection of technology, distraction and force. While this is some of
          the meaning, I believe Cop With Text is more than a joke. Cop With Text is about the evolution of illumination and the
          evolution of Solar Worship. Through the power of God humans have built a technology that is leading us in to the
          unknown. On this journey to the unknown We have a light the can illuminate our internal and external worlds. We as
          humans have never had that before.
        </p>
        <Image src={image6} alt="image6" />
        <p className="py-14">
          I am an artist, entrepreneur and coin trader. I have loved taking risk since I won my first lottery ticket at the age of
          9. I have an MFA from The California College of the Arts in San Francisco. My art work has been discussed or featured in
          the New York Times, Frieze Magazine & Art Forum. I once was on the front page of the Guardian’s weekend Entertainment
          Section. I own a coffee roasting company, a beer brewery and an energy drink company. I have driven a truck full of race
          horses to run at the track and I have collaborated with Turner Prize winner Jeremy Deller. I do not know the meaning of
          life and anyone who says they do is a liar. I do know that Illumination is one of the greatest themes in art. For so
          long though, illumination has only meant the light of the physical world or the source of light in an image as a
          metaphor for knowledge. Now the metaphor is fulfilled. Physical Illumination and Mental Illumination have combined. Yet
          now it is the illumination and comprehension of both our inner and outer worlds. It is something spectacular and we are
          all here to witness it.
        </p>
      </div>
    </div>
  );
}

export default Home;
