import React, { useEffect, useState } from 'react'
//retreive data from localstorage
 const gettodosfromLS=()=>{
  const data = localStorage.getItem('Todos');
  if(data){
    return JSON.parse(data)
  }
  else{
     return []
  }
}
export default function Form() {
    const[todoTxt,settodoTxt]=useState('');
    const[isEdit,setEdit]=useState(false);
    const[id,setId]=useState();
    const handleChange=(e)=>{
           settodoTxt(e.target.value)
    }
    //set todoobject saved from local storage
     const[todoObject,settodoObject]=useState(gettodosfromLS)
    
   //on clicking Add button - 1.set unique id 2.set todoobject
    const handleSubmit=(e)=>{
      e.preventDefault();
        const date = new Date();
        const time=date.getTime()
         let todo={
          id: time,
          todoValue : todoTxt,
          completed : false
        }
      settodoObject([...todoObject,todo])
      settodoTxt('')
    } 

    //saving the todos object local storage
     useEffect(()=>{
      localStorage.setItem('Todos',JSON.stringify(todoObject))    
    },[todoObject])

       //delete item from todolitst
  const handleDelete=(itemId)=>{
      const deletedItems= todoObject.filter((arr)=>{
        return arr.id !== itemId
      })
      settodoObject(deletedItems)
  }
  //edit the todolist items
  const handleEdit=(itemId,updateItem)=>{
      setEdit(!isEdit)
      settodoTxt(updateItem)
      setId(itemId)
  }
 const handleUpdate=(e)=>{
  e.preventDefault();

  const updateItems= todoObject.map((item)=>{
    
    return item.id === id ? {...item,todoValue: todoTxt} : item
  })
 // console.log(updateItems)
   settodoObject(updateItems)
   settodoTxt('')
   setEdit(false)
 }
 const handleCheckbox=(itemId)=>{
  let todoArray = []
   todoObject.forEach((item)=>{
       if(item.id === itemId){
          if(item.completed == false){
             item.completed = true;
          }
          else if(item.completed == true){
             item.completed = false;
          }
       }
       todoArray.push(item)
         settodoObject(todoArray)
    })
 

 }
  return (
    <div className='form'>
       <form autoComplete='off' onSubmit={handleSubmit}>
            <div className='input-and-button'>
              {
                isEdit ? (
                  <>
                <input type='text'  value={todoTxt} onChange={handleChange} required/>
                <button onClick={handleUpdate}>Update</button></>
              ) :(
              <><input type='text' placeholder='Add an Item' value={todoTxt} onChange={handleChange} required/>
                <button type='submit'>Add</button></>)
              }
                
            </div>
       </form>
       {
        todoObject.length > 0 && todoObject.map((item)=>{
          return <div className='todo' key={item.id}>
            <span><input type="checkbox" onChange={()=>handleCheckbox(item.id)}></input></span>
           <span className='todoTxtValue' style= {item.completed === true ? {textDecoration:'line-through'} : {textDecoration:'none'}}>{item.todoValue}</span>
           <div className='edit-and-delete'>
            <div style={{marginRight: 7 + 'px'}}>
            <button onClick={()=>handleEdit(item.id,item.todoValue)}>Edit</button>
           </div>
           <div>
            <button onClick={()=>handleDelete(item.id)}>Delete</button>
            </div>
            </div>
           </div>
        })
       }
    </div>
  )
}
