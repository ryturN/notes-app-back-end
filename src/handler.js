const {nanoid} = require('nanoid');
const notes = require('./notes');


const addNoteHandler = (request, h)=>{
    const {title,tags,body} = request.payload;

    const id = nanoid(18);
    const createdAt= new Date().toISOString();
    const updatedAt= createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    // const isDuplicateTitle = notes.some((note)=> note.title === title); (we can using .some)
    const isDuplicateTitle = notes.map((note)=> note.title).includes(title);
    if (isDuplicateTitle){
        const response = h.response({
            status: 'failed',
            message: 'Title tidak boleh sama!'
        });
        response.code(404 );
        return response
    }
    if (title === '' ){
        const response= h.response({
            status : 'failed',
            message: 'Title tidak boleh kosong!'
        });
        response.code(405);
        return response
    }
    if(body === ''){
        const response = h.response({
            status : 'failed',
            message: 'Body tidak boleh kosong!',
        });
        response.code(405);
        return response
    }
    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

if(isSuccess){
    const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
            noteId: id,
        },
    });
    response.code(201);
    return response
}

const response = h.response({
    status: 'fail',
    message: 'Catatan Gagal Ditambahkan',
});
response.code(500);
return response
};
const getAllNotesHandler=()=>({
    status: 'success',
    data:{
        notes,
    },
})
const getNoteByIdHandler=(request,h)=>{
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];
    if(note !== undefined){
        return{
            status: 'success',
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      });
      response.code(404);
      return response;
};

const editNoteByIdHandler = (request,h)=>{
    const { id }= request.params;

    const {title, tags, body} = request.payload
    const updateAt = new Date().toISOString();
    
    const index = notes.findIndex((note)=> note.id === id);
    if (index !== -1){
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updateAt,
        };
        const response = h.response({
            status : 'success',
            message: 'Catatan berhasil diperbaharui',
        })
        response.code(202)
        return response
    }
    const response = h.response({
        status : 'failed',
        message : 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

const deleteNoteByIdHandler= (request,h)=>{
    const {id} = request.params;

    const index = notes.findIndex((note)=> note.id === id);

    if(index !== -1){
        notes.splice(index,1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil terhapus',
        });
        response.code(202);
        return response
    }
    const response = h.response({
        status: 'fail',
        message : 'Catatan gagal dihapus. id tidak ditemukan'
    })
    response.code(404);
    return response
}
module.exports = {addNoteHandler,
getAllNotesHandler,getNoteByIdHandler,editNoteByIdHandler,deleteNoteByIdHandler}