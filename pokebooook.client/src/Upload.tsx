
import UploadCSS from './Upload.module.css';

const Upload = () => {
    return (
    <>
     <h1>Upload</h1>

    <form className={UploadCSS.form} id="uploadForm" encType="multipart/form-data" method="POST" action="http://localhost:5212/api/Images/Upload">
        <label htmlFor="file">Select an image:</label>
        <input type="file" name="file" id="file" required />
        <button type="submit">Upload Image</button>
    </form>
    </>
    )
}
export default Upload;
