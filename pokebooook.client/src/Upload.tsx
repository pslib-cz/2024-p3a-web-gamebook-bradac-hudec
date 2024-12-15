const Upload = () => {
    return (
        <form id="uploadForm" encType="multipart/form-data" method="POST" action="/api/Images/upload">
            <label htmlFor="file">Select an image:</label>
            <input type="file" name="file" id="file" required />
            <button type="submit">Upload Image</button>
        </form>
    )
}
export default Upload;
