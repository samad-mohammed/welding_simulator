import React from 'react'
import UploadBook from './UploadBook'
import ShowUploads from './ShowUploads'
export default function InstructorComp({notify}) {
  return (
    <div>
        <UploadBook  notify={notify}/>
        <h1 className="display-6" >Uploaded books</h1>
        <ShowUploads notify={notify}/>
    </div>
  )
}
