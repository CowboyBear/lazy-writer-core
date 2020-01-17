module.exports = (error, stdout, stderr) => {
  if (error) {
    console.log('Error while creating entity: ', stderr);
    return;
  } 
  
  console.log('Angular component created!');  
}