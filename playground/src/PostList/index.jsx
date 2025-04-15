import {createContext, useContext, useState} from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import {ImageSizeContext} from "./Context";


export default function PostList() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;

  return (
    <>
      <ImageSizeContext value={imageSize}>
        <label>
          <input
            type="checkbox"
            checked={isLarge}
            onChange={() => setIsLarge(!isLarge)}
          />
          Use large images
        </label>
        <hr />
        <List />
      </ImageSizeContext>
    </>
  );
}

function List() {
  const listItems = places.map((place) => (
    <li key={place.id}>
      <Place place={place} />
    </li>
  ));
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
