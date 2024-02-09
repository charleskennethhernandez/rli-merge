const express = require('express');
const bodyParser = require('body-parser');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const path = require('path');
const app = express();
const port = 3000;
//added for mfiles uploading
const axios = require('axios');
const FormData = require('form-data');

app.use(bodyParser.json());

app.post('/merge-pdf', async (req, res) => {
  try {
    const { voucher_number, ...additionalVariables } = req.body;

    // Constructing JSON_INPUT dynamically based on the provided JSON data
    const JSON_INPUT = {
      author: req.body.author,
      Company: {
        Name: req.body.Company.Name,
        Address: req.body.Company.Address,
        PhoneNumber: req.body.Company.PhoneNumber
      },
      Invoice: {
        Date: req.body.Invoice.Date,
        Number: req.body.Invoice.Number,
        Items: req.body.Invoice.Items.map(item => ({
          item: item.item,
          description: item.description,
          UnitPrice: item.UnitPrice,
          Quantity: item.Quantity,
          Total: item.Total
        }))
      },
      Customer: {
        Name: req.body.Customer.Name,
        Address: req.body.Customer.Address,
        PhoneNumber: req.body.Customer.PhoneNumber,
        Email: req.body.Customer.Email
      },
      Tax: req.body.Tax,
      Shipping: req.body.Shipping,
      clause: {
        overseas: req.body.clause.overseas
      },
      paymentMethod: req.body.paymentMethod
    };

    const credentials = PDFServicesSdk.Credentials
      .servicePrincipalCredentialsBuilder()
      .withClientId('05494adc268446379930dd0ecffa010d')
      .withClientSecret('p8e-0fuO8uyFWo9uAMmf0zWoAU0_uXzEAEQU')
      .build();

    const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
    const documentMerge = PDFServicesSdk.DocumentMerge;
    const documentMergeOptions = documentMerge.options;

    // Merging JSON_INPUT with additionalVariables
    const options = new documentMergeOptions.DocumentMergeOptions(
      { voucher_number, ...JSON_INPUT, ...additionalVariables },
      documentMergeOptions.OutputFormat.PDF
    );

    const documentMergeOperation = documentMerge.Operation.createNew(options);

    const INPUT = './tmp/receiptTemplate.docx';
    const input = PDFServicesSdk.FileRef.createFromLocalFile(INPUT);
    documentMergeOperation.setInput(input);

    const result = await documentMergeOperation.execute(executionContext);

    // Set the PDF filename dynamically based on the voucher_number
    const OUTPUT = `./tmp/${voucher_number}_generatedReceipt.pdf`;
    await result.saveAsFile(OUTPUT);

    // Generate a public URL for the saved PDF file
    const publicUrl = `http://localhost:${port}/pdfs/${voucher_number}_generatedReceipt.pdf`; // Replace with your actual server domain
    // res.status(200).json({ url: publicUrl });
    // uploading success doc to mfiles

	const axios = require('axios');
	const FormData = require('form-data');
	const fs = require('fs');
	let data = new FormData();
	let credential = JSON.stringify({"username":"rli.ggvivar","password":"Blitz@072218", "VaultGuid": "{cad8d7cc-a4db-4bc2-96e0-be2b15a9cedf}",
	"sessionID" : "e04084af-02cf-4009-bb83-2732cd5a6ffc"});
	//Start Get Authentication
	data.append('', fs.createReadStream(OUTPUT));
	let config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://rli-storefront.cloudvault.m-files.com/REST/server/authenticationtokens.aspx',
	  headers: { 
		'Content-Type': 'application/json', 
		'Cookie': 'ASP.NET_SessionId=atwa14kkrjim0wjk1h52zi23; fileDownload=true; mfilesmsm=f7267a88e2e4093a'
	  },
	  data : credential
	};
	axios.request(config)
	.then((response) => {
	authtoken = response.data.Value;
	//Authentication Success	
	//Start Uploading Temp File
	let config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://rli-storefront.cloudvault.m-files.com/REST/files',
	  headers: { 
		'Content-Type': 'application/json', 
		'X-Authentication': authtoken, 
		...data.getHeaders()
	  },
	  data : data
	};
	axios.request(config)
	.then((response) => {
	//Success Uploading Temp File
	//Start Uploading to MFILEs
	let data = JSON.stringify({
	  "PropertyValues": [
		{
		  "PropertyDef": 0,
		  "TypedValue": {
			"DataType": 1,
			"Value": "INV00004"
		  }
		},
		{
		  "PropertyDef": 1027,
		  "TypedValue": {
			"DataType": 10,
			"Lookups": [
			  {
				"Item": 64,
				"Version": -1
			  }
			]
		  }
		},
		{
		  "PropertyDef": 1032,
		  "TypedValue": {
			"DataType": 1,
			"Value": "JN-123123"
		  }
		},
		{
		  "PropertyDef": 1048,
		  "TypedValue": {
			"DataType": 1,
			"Value": "Ortigas Center"
		  }
		},
		{
		  "PropertyDef": 1049,
		  "TypedValue": {
			"DataType": 1,
			"Value": "0912321334"
		  }
		},
		{
		  "PropertyDef": 1033,
		  "TypedValue": {
			"DataType": 1,
			"Value": "tst@gmail.company"
		  }
		},
		{
		  "PropertyDef": 1045,
		  "TypedValue": {
			"DataType": 1,
			"Value": "ZAYA"
		  }
		},
		{
		  "PropertyDef": 1046,
		  "TypedValue": {
			"DataType": 1,
			"Value": "Cavite"
		  }
		},
		{
		  "PropertyDef": 1047,
		  "TypedValue": {
			"DataType": 1,
			"Value": "02-888888"
		  }
		},
		{
		  "PropertyDef": 1050,
		  "TypedValue": {
			"DataType": 1,
			"Value": "1"
		  }
		},
		{
		  "PropertyDef": 1051,
		  "TypedValue": {
			"DataType": 1,
			"Value": "ZYA-BR1-PR"
		  }
		},
		{
		  "PropertyDef": 1053,
		  "TypedValue": {
			"DataType": 1,
			"Value": "1"
		  }
		},
		{
		  "PropertyDef": 1054,
		  "TypedValue": {
			"DataType": 1,
			"Value": "100000"
		  }
		},
		{
		  "PropertyDef": 22,
		  "TypedValue": {
			"DataType": 8,
			"Value": false
		  }
		},
		{
		  "PropertyDef": 100,
		  "TypedValue": {
			"DataType": 9,
			"Lookup": {
			  "Item": 8,
			  "Version": -1
			}
		  }
		}
	  ],
	  "Files": [
		{
		  "UploadID": response.data.UploadID,
		  "Size": response.data.Size,
		  "Title": "INV00004",
		  "Extension": "docx"
		}
	  ]
	});

	let config = {
	  method: 'post',
	  maxBodyLength: Infinity,
	  url: 'https://rli-storefront.cloudvault.m-files.com/REST/objects/0?checkIn=true',
	  headers: { 
		'x-authentication': authtoken,
		'Content-Type': 'application/json' 
		//'Cookie': 'ASP.NET_SessionId=atwa14kkrjim0wjk1h52zi23; mfilesmsm=f7267a88e2e4093a'
	  },
	  data : data
	};
	axios.request(config)
	.then((response) => {
	 //Success Uploading in MFILES
	  console.log("https://rli-storefront.cloudvault.m-files.com/rest/objects/0/"+ response.data.DisplayID +"/files/" + response.data.Files[0].ID+ "/content");
	  var file_url = "https://rli-storefront.cloudvault.m-files.com/rest/objects/0/"+ response.data.DisplayID +"/files/" + response.data.Files[0].ID+ "/content";
	  res.status(200).json({ url: file_url });
	  let config = {
	  method: 'delete',
	  maxBodyLength: Infinity,
	  url: 'https://rli-storefront.cloudvault.m-files.com/REST/session',
	  headers: { 
		'Content-Type': 'application/json', 
		'X-Authentication': authtoken
	  }
	};
	axios.request(config)
	.then((response) => {
	  console.log(JSON.stringify(response.data));
	})
	.catch((error) => {
	  console.log(error);
	});

	  //console.log(JSON.stringify(response.data));
	})
	.catch((error) => {
	  console.log("Error on Document Creation");
	});
	  
	})
	.catch((error) => {
	  console.log("Error on File generation");
	});

	})
	.catch((error) => {
	  console.log("Error on authentication");
	});// end of mfiles uploading

	  } catch (error) {
		console.error('Exception encountered while executing operation', error);
		res.status(500).send('Internal Server Error');
	  }
	});

	app.listen(port, () => {
	  console.log(`Server listening at http://localhost:${port}`);
	});
