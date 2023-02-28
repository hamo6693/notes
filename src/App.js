import React, { useState,useEffect } from 'react';
import './App.css';
import Preview from './compoents/Preview'; {/* 04:48كاين كلام حول طريقة الاستيراد الفيديو 05 إضافة ملاحظه الدقيقه */}
import Message from './compoents/Message';
import NotesContainer from './compoents/Notes/NotesContainer';
import NotesList from './compoents/Notes/NotesList';
import Note from './compoents/Notes/Note';
import NoteForm from './compoents/Notes/NoteForm';
import Alert from './compoents/Alert.js';


function App() {

  const [notes,setNotes]= useState([]);
  const [title,setTitle]= useState('');
  const [content,setContent]= useState('');
  const [selectedNote,setSelectedNote]= useState(null);
  const [creating,setCreating ]= useState(false);
  const [edating,setEdating]= useState(false);
  const [validationErrors,setValidationErrors] = useState([])

  useEffect(() => {
    if(localStorage.getItem("notes")) {
      setNotes(JSON.parse(localStorage.getItem("notes"))); 
    } else {
      localStorage.setItem("notes",JSON.stringify([]));
    }
  },[]);

  useEffect(() => {
    if(validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([])
      },3000)
    }
  },[validationErrors])

  const saveToLocaleStorage = (key,value) => {
    localStorage.setItem(key,JSON.stringify(value))
  }

  const validator = () => {
    const validationErrors = []
    let passed = true;
    if(!title) {
      validationErrors.push("الرجاء ادخال العنوان")
      passed = false
    }
    if(!content) {
      validationErrors.push("الرجاء ادخال المحتوى")
      passed = false
    }
    setValidationErrors(validationErrors)
    return passed
  }

  const changeTitleHandler = (event) => {
  setTitle(event.target.value);
  }
  
  const changeContentHandler = (event) =>{
  setContent(event.target.value);
  }

  const saveNoteHandler = () => {
    if(!validator()) return;
    const note = {
      id:new Date(),
      title:title,
      content:content
    }
    const updatedNotes = [...notes,note]
    saveToLocaleStorage("notes",updatedNotes)
    setNotes(updatedNotes)
    setCreating(false)
    setSelectedNote(note.id)
  }

  //اختيار ملاحظة
  const selectNoteHandler = noteId => {
    setSelectedNote(noteId)
    setCreating(false)
    setEdating(false)
  }
  //الانتقال الى وضع تعديل الملاحظة
  const editNoteHandler = () => {
    const note = notes.find(note => note.id === selectedNote)
    setEdating(true)
    setTitle(note.title)
    setContent(note.content)
  }

  const updateNoteHandler = () => {
    if(!validator()) return;
    const updatedNotes = [...notes]
    const noteIndex = notes.findIndex(note => note.id === selectedNote)
    updatedNotes[noteIndex] = {
      id:selectedNote,
      title:title,
      content:content
    }
    saveToLocaleStorage("notes",updatedNotes)
    setNotes(updatedNotes)
    setEdating(false)
    setTitle("")
    setContent("")
  }
  //واجهة اضافة ملاحظة
  const addNoteHandler = () => {
  setCreating(true)
  setEdating(false)
  setContent("")
  setTitle("")
}

const deleteNoteHandler = () => {
  const updatedNotes = [...notes]
  const noteIndex = updatedNotes.findIndex(note => note.id === selectedNote)
  notes.splice(noteIndex,1)
  saveToLocaleStorage("notes",notes)
  setNotes(notes)
  setSelectedNote(null)
}


  const getAddNote = () => {
    return (
      <NoteForm 
      formTitle="ملاحظة جديدة"
      title={title}
      content={content}
      titleChanged={changeTitleHandler}
      contentChanged={changeContentHandler}
      submitText="حفظ"
      submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if(notes.length === 0) {
      return <Message title="لاتوجد ملاحظة لعرضها" />
    }
    if(!selectedNote) {
      return <Message title="يرجى اختيار ملاحظة" />
    }
    //get notes
    const note = notes.find(note => {
      return note.id === selectedNote
    })

    let noteDisplay = (
      <div>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    )
    if (edating) {
      noteDisplay = (
        <NoteForm 
      formTitle="تعديل ملاحظة "
      title={title}
      content={content}
      titleChanged={changeTitleHandler}
      contentChanged={changeContentHandler}
      submitText="تعديل"
      submitClicked={updateNoteHandler}
      />
      )
    }

    return (
      <div>
        {!edating && 
         <div className="note-operations">
          <a href="#" onClick={editNoteHandler}>
            <i className="fa fa-pencil-alt" />
          </a>
          <a href="#" onClick={deleteNoteHandler}>
            <i className="fa fa-trash" />
          </a>
        </div>
        }
       
        {noteDisplay}
      </div>
    );
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map(note => 
          <Note key={note.id} 
          title={note.title} 
          noteClicked={() => selectNoteHandler(note.id)} 
          active={selectedNote === note.id}
          />)}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>+</button>
      </NotesContainer>
      <Preview>
        {creating ? getAddNote() : getPreview()}
      </Preview>
      {validationErrors.length !==0 && <Alert validationMessages={validationErrors} />}
    </div>
  );
}

export default App;
