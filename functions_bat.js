var intro = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">'+
'<html>'+
'<head>'+
'<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'+
'<title></title>'+
'<style type="text/css">'+
'.ansi2html-content { display: inline; white-space: pre-wrap; word-wrap: break-word; }'+
'.body_foreground { color: #AAAAAA; }'+
'.body_background { background-color: #000000; }'+
'.inv_foreground { color: #000000; }'+
'.inv_background { background-color: #AAAAAA; }'+
'.ansi1 { font-weight: bold; }'+
'.ansi31 { color: #aa0000; }'+
'.ansi32 { color: #00aa00; }'+
'.ansi33 { color: #aa5500; }'+
'.ansi34 { color: #0000aa; }'+
'.ansi35 { color: #E850A8; }'+
'.ansi36 { color: #00aaaa; }'+
'.ansi37 { color: #F5F1DE; }'+
'.ansi90 { color: #7f7f7f; }'+
'</style>'+
'</head>'+
'<body class="body_foreground body_background" style="font-size: normal;" >'+
'<pre class="ansi2html-content">';

//List of Headers from the PEAS file to break down output file
var topics_1 = [
['System Information'],
['Interesting Events information'],
['Users Information'],
['Processes Information'],
['Services Information'],
['Applications Information'],
['Network Information'],
['Windows Credentials'],
['Browsers Information'],
['Interesting files and registry'],
['File Analysis']
];

let parsed_data = new Object();

function create_list_buttons()
{
	var c = 0;
	var z = 0;

	for (let i of topics_1) {
		count = 0;

		let listnew = document.createElement('li');
		listnew.setAttribute("class","mb-1");
	
		listnew.setAttribute('id',"u"+c.toString()+z.toString());
		let buttonnew = document.createElement('button');
		buttonnew.setAttribute("class","btn btn-toggle align-items-center rounded collapsed");
		buttonnew.setAttribute('data-bs-toggle','collapse');
		buttonnew.setAttribute('data-bs-target','#m'+c.toString()+z.toString()+'-collapse');
		buttonnew.setAttribute('aria-expanded','false');

		buttonnew.textContent = i[0];
		document.getElementById("winpeasCategories").appendChild(listnew);
		document.getElementById(("u"+c.toString())+z.toString()).appendChild(buttonnew);

		let divnew = document.createElement('div');
		divnew.className='collapse';
		divnew.setAttribute('id','m'+c.toString()+z.toString()+'-collapse');
		
		let ulnew = document.createElement('ul');
		ulnew.setAttribute('id',c.toString()+z.toString()+'sub-1');
		ulnew.className = 'btn-toggle-nav list-unstyled fw-normal pb-1 small';

		document.getElementById("winpeasCategories").appendChild(divnew);
		document.getElementById('m'+c.toString()+z.toString()+"-collapse").appendChild(ulnew);
		

		
		for (let j of i) {
			if (count <= (i.length)-1)
			{
				count = count + 1;

				let buttonnew1 = document.createElement('button');
				buttonnew1.className = 'link-dark rounded';
				buttonnew1.setAttribute('id',c.toString()+(count-1).toString());
				buttonnew1.textContent = j;
				document.getElementById(c.toString()+z.toString()+'sub-1').appendChild(buttonnew1);

				
			}
			
		}
		c = c + 1;
	}

	
	

}
		
//This function returns an array with [header,colour.text] for each header
function parse_text()
{
   


    let input = document.querySelector('input')
    let textarea = document.querySelector('textarea')

    // This event listener has been implemented to identify a
    // Change in the input section of the html code
    // It will be triggered when a file is chosen.
    input.addEventListener('change', () => {
        let files = input.files;

        if (files.length == 0) return;

        /* If any further modifications have to be made on the
        Extracted text. The text can be accessed using the
        file variable. But since this is const, it is a read
        only variable, hence immutable. To make any changes,
        changing const to var, here and In the reader.onload
        function would be advisible */
        const file = files[0];
        const leader = '<span class="ansi1 ansi36">????????????????????????????????????? </span><span class="ansi1 ansi32">';
	
		
        let reader = new FileReader();

        reader.onload = (e) => {
            const file = e.target.result;

            // This is a regular expression to identify carriage
            // Returns and line breaks
            const lines = file.split(/\r\n|\n/);
            data = lines.join('\n');
			
			for (let x = 0; x < topics_1.length; x++) {
				
				for (let y = 0; y < topics_1[x].length; y++){
					
					var s = x;
					var t = y;
					//Scan the text for the heading in the array and make note of the position
					var start_pos = data.indexOf(leader+topics_1[s][t]) + topics_1[s][t].length;
					
					//check if there is a next column in the array, if not, go to the next row
					if (y==(topics_1[x].length-1)){
						s = x + 1;
						t = -1;

					}
					//check if there is a next row in the array, if not, assign to the end of the file
					if (x==(topics_1.length-1) & (y==(topics_1[x].length-1))){
						end_pos = data.length;
					}
					else {
						//Scan the text for the heading of the next topic in the array and take note of the position
						var end_pos = data.indexOf(leader+topics_1[s][t+1]);
					}
					parsed_data[x.toString()+y.toString()]=data.slice(start_pos,end_pos);

					
				}
			}
			
			addButtonEvents();

        };

        reader.onerror = (e) => alert(e.target.error.name);
        reader.readAsText(file);
        }
    );
	
	console.log("here1");
}


//Add click events to buttons
function addButtonEvents(){

	function showText(){
		
		//document.getElementById('textZone').value=parsed_data[this.id];
        document.getElementById('textZone').contentWindow.document.body.innerHTML=intro+parsed_data[this.id];

		
	}
	//cycle through all the buttons
	for (let y = 0; y < topics_1.length; y++) {
		for(let x = 0; x < topics_1[y].length; x++){
			elem = document.getElementById(y.toString()+x.toString());
			elem.addEventListener("click",showText);

			

		}
		
	}
}


