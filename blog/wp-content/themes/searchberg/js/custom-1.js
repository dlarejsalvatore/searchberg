

	function validateCaptcha()

            {

	var flag = true;

	var Name = document.getElementById("Name").value;

	var CompanyName = null; //document.getElementById("CompanyName").value;

	var Numb = document.getElementById("Number").value;

	var Email = document.getElementById("Email").value;

	var Website = document.getElementById("Website").value;

	var RequiredServices = document.getElementById("RequiredServices").value;

	var ctry=document.getElementById("country").value;
	
	var timezone=document.getElementById("timezone").value;

	var Details = document.getElementById("Details").value;

	//var Details="Country Name:&nbsp;" + ctry + "<br />" + document.getElementById("Details").value;

	var Subject = document.getElementById("Subject").value;

	var code = null;

	var VisitorID = readCookie('VisitorID');

	var Source = 19;

     if(Name == "" || /*c_name == "Company Name" || p_number == "Phone Number" ||*/ Email == "" || /* website == "website" || required_services == "Select Your Required Service" ||*/ Details == "")

       {

        flag = false;

       }

       if(flag) {

                    {

           jQuery('.submit-btn').addClass('loading');					

           window.location = 'https://clients.searchberg.com/onlinesps/sb_submit.aspx?Name=' + Name + '&Subject=' + Subject + '&CompanyName=' + CompanyName + '&Number=' + Numb + '&Email=' + Email + '&Website=' + Website + '&RequiredServices=' + RequiredServices + '&Source=' + Source + '&Country=' + ctry + '&Details=' + Details + '&VisitorID=' + VisitorID + '&TimeZone=' + timezone;

                }           

        }

     else

      {

      alert("One or more required field(s) are empty. \n\nRequired fields are: \n\nName \n\nEmail address \n\nProject details" );

return false;

      }

}	

  