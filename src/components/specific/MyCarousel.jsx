import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import "../../styles/index.css";
import { Link } from 'react-router-dom';
const MyCarousel = ({ category }) => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="carousel-container">
            <Carousel activeIndex={index} onSelect={handleSelect}>
                {category?.map((c) => (
                    <Carousel.Item key={c.id}>
                        <Link to={`/category/${c?.slug}`}>
                            <img
                                src={c.image}
                                alt={c.title}
                                className="carousel-image"
                            />
                        </Link>
                        <Carousel.Caption>
                            <h3>{c.title}</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default MyCarousel;
