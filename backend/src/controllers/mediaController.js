const fs = require('fs');
const path = require('path');

const uploadImage = (req, res) => {
    if (req.file) {
        res.json({
            message: 'Image uploaded successfully',
            url: `/uploads/${req.file.filename}`
        });
    } else {
        res.status(400).json({ message: 'Failed to upload image' });
    }
};

const getMedia = (req, res) => {
    const directoryPath = path.join(__dirname, '../../uploads');
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return res.status(500).json({ message: 'Unable to scan files' });
        }
        const fileInfos = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));
        res.json(fileInfos);
    });
};

const deleteMedia = (req, res) => {
    const fileName = req.params.id;
    const directoryPath = path.join(__dirname, '../../uploads');

    fs.unlink(directoryPath + '/' + fileName, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Could not delete the file: ' + err });
        }
        res.json({ message: 'File is deleted.' });
    });
};

module.exports = { uploadImage, getMedia, deleteMedia };
