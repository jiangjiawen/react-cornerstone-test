export const getfilename=(data)=>{
    const newAarry=data.slice(data.indexOf("<table>"),data.indexOf("</table>"));
    
    var positions = [];
    var pos = newAarry.indexOf("</a></td></tr>");

    while(pos > -1){
      positions.push(pos);
      pos = newAarry.indexOf("</a>",pos + 1);
    }
    // console.log(positions)

    var positions2 = [];
    var pos2 = newAarry.indexOf("<a href=");

    while(pos2 > -1){
      positions2.push(pos2);
      pos2 = newAarry.indexOf("<a href=",pos2 + 1);
    }
    // console.log(positions2)

    var filenames = [];
    for(var i=0;i<positions.length;i++){
      const hn= newAarry.slice(positions2[i],positions[i]).split(">")[1];
      filenames.push(hn);
    }

    // console.log(filenames);
    return filenames;
};