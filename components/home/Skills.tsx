import "./home.css"
import Contact from "@/components/home/Contact";
import AboutMe from "@/components/home/AboutMe";
import data from "./data/index.json";

/**
 * Component for rendering the Skills section.
 *
 * This component displays the Skills section with a list of skills, each represented by an image, title, and description.
 *
 * @returns {JSX.Element} The rendered Skills section component.
 */
function Skills() {
    return (
        <section className="skills--section" id="mySkills">
            <div className="portfolio--container">
                <p className="section--title">My Skills</p>
                <h2 className="skills--section--heading">My Expertise</h2>
            </div>
            <div className="skills--section--container">
                {data?.skills?.map((item, index) => (
                    <div key={index} className="skills--section--card">
                        <div className="skills--section--img">
                            <img src={item.src} alt="Product Chain" />
                        </div>
                        <div className="skills--section--card--content">
                            <h3 className="skills--section--title">{item.title}</h3>
                            <p className="skills--section--description">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Skills;