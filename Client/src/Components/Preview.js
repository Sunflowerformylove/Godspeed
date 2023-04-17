import "../Style/Preview.css";

export function ImagePreview(props) {
  return (
    <>
      <div className="previewImageContainer">
      <i className="fa-solid fa-xmark removePreview"></i>
        <img src={props.url} alt="preview" className="previewImage" />
      </div>
    </>
  );
}
