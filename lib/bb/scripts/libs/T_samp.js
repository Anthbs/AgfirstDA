var info = {};
			var i=0;
			var n=0;
			
			// Create Objects
			var sampleObj = Create('component','NetLabAGF.Sample');
			 // Check to see if its new cultivars 
			/* Grab the data to print on the labels	
			
				Format:
							sampleList = [sample(s)]
							sample     = T_Sample data + labelCount + testsReqList
			*/
			
			info.sampleList = [];
			
			// regular single sample
			info.sampleListTemp = [arguments.sampleno];
				
			// loop thru the list of samples and get full sample detail + testsReq 
			// nb: This is not very efficient but reduces the need to duplicate queries/functions.
				
			for (i=1; i<=ArrayLen(info.sampleListTemp); i++){
				
				// Get Sample
				info.sampleDetails = sampleObj.getSampleDetails(searchType="sampleNo",sampleNo = info.sampleListTemp[i]);
				
				// Create Struct to hold label information			
				info.sampleInfo = {};
				
				// Get required test list for this sample
				info.sampleInfo['TESTLIST'] = sampleObj.getSampleTestsRequired(testsReq=info.sampleDetails.testsReq);
				
				// Get label count
				info.sampleInfo['LABELCOUNT'] = sampleObj.boxCount(info.sampleDetails.fruitcollect);

				info.sampleInfo['LABELCOUNT'] = arguments.labelCount;
			
				// Set label file name
				if (ArrayLen(info.sampleInfo['TESTLIST']) < 12){
					info.sampleInfo['LABEL'] = '2010_NL_Sample_Small';
				}else{
					info.sampleInfo['LABEL'] = '2010_NL_Sample_Large';	
				}// title for label print page only
				info.sampleInfo['TITLE'] = "Sample #arguments.sampleNo#";
				
				/* These vars are not returned, not used - MikeLee review 31jul2013
				// Set label data fields
				traylabel = '';
				traylabelcolour = '';
				
				if (structKeyExists(client, "NLPrefs") and application.helper.misc.inList(client.NLPrefs,'15') GT 0){
					traylabel = 'TRAY COLOUR';
					traylabelcolour = Left(form.labtraycolour,1);
				}
				*/
				
				info.sampleInfo['DATA'] = { 
					SAMPLENO : info.sampleDetails.sampleNo,
					BARCODE : info.sampleDetails.sampleNo,
					SAMPTYPE : info.sampleDetails.sampleType,
					GROWERNO : info.sampleDetails.growerNumber,
					VARIETY : info.sampleDetails.variety,
					MATAREANAME : info.sampleDetails.matareaname,
					COMMENTS : Replace(Replace(Left(info.sampleDetails.samplecomments,72),'"','','all'),"'","","all"),	/* fix quote bug from CF */
					TIMESTAMP : DateFormat(client.TZNow) & " " & TimeFormat(client.TZNow),
					TESTSREQ : info.sampleDetails.testsreq
				};
				
				/* EXCEPTIONS BEGIN */
				
				// Handle skipping tests based on label number
				info.sampleInfo['SKIP_TESTS'] = {};		// labelNum = [testsToSkip] }
				
				// Brix Exception. Only show Brix tests upto BrixNum field (if null always show)
				if (info.sampleDetails.BrixNo != "") {
					// get number of labels to print brix tests for
					n = sampleObj.boxCount(info.sampleDetails.BrixNo);
					// Skip any above that number
					for (x=(n+1); x<=info.sampleInfo['labelCount']; x++)
						info.sampleInfo['SKIP_TESTS'][x] = ['BSB','BC','BEq','BRB','BBB',' ','BrB'];
				
				}
				// Handle making BC show as blank (john's request, UGH)
				for (n=1; n<=ArrayLen(info.sampleInfo['TESTLIST']); n++){
					// John don't want to print FDT on the label. Supervisor alert is enough now.
					if (info.sampleInfo['TESTLIST'][n] == 'BC' || info.sampleInfo['testList'][n] == 'FDT') {
						info.sampleInfo['TESTLIST'][n] = ''; 
					}
				}
				for (n=ArrayLen(info.sampleInfo['TESTLIST']); n>0; n--)
					if (info.sampleInfo['TESTLIST'][n] = '' ) {
						arrayDeleteAt(info.sampleInfo['TESTLIST'],n);
					}
			
					
				if (client.labcoID === "AGF"){	
					// Handle making Bcut show as blank (john's request, UGH)
					for (n=1; n<=ArrayLen(info.sampleInfo['TESTLIST']); n++)
						if (info.sampleInfo['TESTLIST'][n] === 'Bcut'){
							info.sampleInfo['TESTLIST'][n] = ' '; 
						} 
	
					// Handle making TA show as blank (john's request, UGH)
					for (n=1; n<=ArrayLen(info.sampleInfo['TESTLIST']); n++){
						if (info.sampleInfo['TESTLIST'][n] === 'TA'){
							info.sampleInfo['TESTLIST'][n] = ''; 
						}
					}
					// Handle making NUT show as blank (john's request, UGH)
					for (n=1; n<=ArrayLen(info.sampleInfo['TESTLIST']); n++)
						if (info.sampleInfo['TESTLIST'][n] === 'NUT') {
							info.sampleInfo['TESTLIST'][n] = ''; 	
						}
					for (n=ArrayLen(info.sampleInfo['TESTLIST']); n>0; n--)
						if (info.sampleInfo['TESTLIST'][n] === '' ) {
							arrayDeleteAt(info.sampleInfo['TESTLIST'],n);
						}
						
				}
				
				/* EXCEPTIONS END */
						
				ArrayAppend(info.sampleList,duplicate(info.sampleInfo));

			}

			if(!arrayLen(info.sampleList)) {
			this.data=null;	
			
			}
			this.data = info.sampleList;
			
			Return(data);
