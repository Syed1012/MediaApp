// ./src/layout/CardComponent.js

import React from "react";
import "../styles/CardComponent.css";

const CardComponent = ({
  imgSrc,
  imgAlt,
  title,
  description
}) => {
  return (
    
      <div className="card">
        {imgSrc && imgAlt && (
          <img src={imgSrc} alt={imgAlt} className="CardImg" />
        )}

        {title && <h1 className="CardTitle">{title}</h1>}
        {description && <p className="card-description">{description}</p>}
      </div>
  );
};

export default CardComponent;
