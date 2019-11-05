const QuillTableUI = require('quill-table-ui');
window.addEventListener('DOMContentLoaded',()=>{
  console.log('Donewewe');
  if (window.Quill) {
     window.Quill.register({'modules/tableUI': QuillTableUI},true);
     console.log('Done');
  }
})