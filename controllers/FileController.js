import File from '../models/files.js';
class FileController {
    async store(req, res) {
        console.log('this is req.file in filecontroller ->' + req.file);
        const { originalname: name, filename: path } = req.file;

        const file = await File.create({
            name,
            path,
        });

        return res.json(file);

    }
}
export default new FileController();






















