<?php
/*
ccJobCost2FPDP.php
tjs 091113

file version 1.06 

release version 1.19
*/
require ('fpdf.php');

class PDF extends FPDF
{	
//Load data
/*
function LoadData($file)
{
    //Read file lines
    $lines=file($file);
    $data=array();
    foreach($lines as $line)
        $data[]=explode(';',chop($line));
    return $data;
}*/

//Colored table
function OptionTable($header,$data)
{
    //Colors, line width and bold font
    $this->SetFillColor(255,0,0);
    $this->SetTextColor(255);
    $this->SetDrawColor(128,0,0);
    $this->SetLineWidth(.3);
    $this->SetFont('','B');
    //Header
    //$header=array('Item Name','SKU','Attributes','Description','Unit Price','Quantity','Price');
    //$w=array(40,35,40,45);
    //$w=array(20,20,30,40,15,15,20);
    //$w=array(20,20,30,50,20,20,20);
    $w=array(20,20,30,60,20,20,20);
    for($i=0;$i<count($header);$i++)
        $this->Cell($w[$i],7,$header[$i],1,0,'C',true);
    $this->Ln();
    //Color and font restoration
    $this->SetFillColor(224,235,255);
    $this->SetTextColor(0);
    $this->SetFont('');
    //Data
    $fill=false;
    $fontTableSize = 12;
    $fontCurrentSize = $fontTableSize;
    $fontMinTableSize = 9;

    foreach($data as $row)
    {
        $this->Cell($w[0],6,$row[0],'LR',0,'L',$fill);
        $this->Cell($w[1],6,$row[1],'LR',0,'L',$fill);
        $this->Cell($w[2],6,$row[2],'LR',0,'L',$fill);
        $this->Cell($w[3],6,$row[3],'LR',0,'L',$fill);
	if ((float) $row[4] == 0) {
		$this->Cell($w[4],6,' ','LR',0,'L',$fill);
	} else {
		$this->Cell($w[4],6,number_format($row[4],2),'LR',0,'R',$fill);
	}
	if ((float) $row[5] == 0) {
		$this->Cell($w[5],6,' ','LR',0,'L',$fill);
	} else {
		$this->Cell($w[5],6,number_format($row[5]),'LR',0,'R',$fill);
	}
        $this->Cell($w[6],6,number_format($row[6],2),'LR',0,'R',$fill);
        $this->Ln();
        $fill=!$fill;
    }
    $this->Cell(array_sum($w),0,'','T');
}
}

function truncateText($text, $maxChars) {
	$truncatedText = $text;
	$len = strlen($truncatedText);
	
	while ($len > $maxChars) {
		$truncatedText = substr($truncatedText, 0, -1);
		$len = strlen($truncatedText);
	}	
	return $truncatedText;
}

//$pdf=new FPDF();
$pdf=new PDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);
//$pdf->SetFontWrapper('Arial','B',16);

//echo "start";

$account = $_GET['account'];
require_once( "Member.class.php" );
session_start();

//$account = 0;
//if ($account == 0 && isset($_SESSION['member'])) {
if (isset($_SESSION['member'])) {
	$member = $_SESSION['member'];
	$account = $member->getValue( "id" );
} 
$jobId = $_GET['jobId'];

if (strlen($account) > 0) {
	//echo $account;
} else {
	echo "No account";
}
if (strlen($jobId) > 0) {
	//echo $jobId;
} else {
	echo "No jobId";
}

function trimNewLine($str) {
	return substr($str, 0, strlen($str) - 1);
}

// set name of XML file
$file = "xml/".$account."/jobs.xml";

// load file
$jobs_xml = simplexml_load_file($file) or die ("Unable to load jobs XML file!");

//also load files to be queried
// account file
$file = "xml/".$account."/account.xml";
$account_xml = simplexml_load_file($file) or die ("Unable to load account XML file!");
// customer file
$file = "xml/".$account."/customers.xml";
$customers_xml = simplexml_load_file($file) or die ("Unable to load customers XML file!");
// type file
$file = "xml/".$account."/types.xml";
$types_xml = simplexml_load_file($file) or die ("Unable to load types XML file!");
// option file
$file = "xml/".$account."/options.xml";
$options_xml = simplexml_load_file($file) or die ("Unable to load options XML file!");
// part file
$file = "xml/".$account."/parts.xml";
$parts_xml = simplexml_load_file($file) or die ("Unable to load parts XML file!");

// access XML data
//echo "Parents: " . $xml->parents->mother . " and " .  $xml->parents->father . "\n";
//echo "description: " . $xml->job[0]->description . "\n";
$contractorName = trimNewLine($account_xml->name);
//Cell(float w [, float h [, string txt [, mixed border [, int ln [, string align [, boolean fill [, mixed link]]]]]]])
$pdf->Cell(0,20,$contractorName,0,1,'C');
$contractorStreet1 = trimNewLine($account_xml->street1);
$pdf->Cell(0,10,$contractorStreet1,0,1,'C');
$cityStateZip = sprintf("%s, %s %s", trimNewLine($account_xml->city), trimNewLine($account_xml->state), trimNewLine($account_xml->zip));
$pdf->Cell(0,10,$cityStateZip,0,1,'C');
$telephoneInfo = 'TEL: '.$account_xml->phones[0]->phone;
$pdf->Cell(0,10,$telephoneInfo,0,1,'C');
$urlInfo = $account_xml->url;
if (strlen($urlInfo) > 0) {
	$pdf->Write(5,'Web Site: ');
	//Then put a blue underlined link
	$pdf->SetTextColor(0,0,255);
	$pdf->SetFont('','U');
	$url = 'http://'.$urlInfo;
	$pdf->Write(5,$urlInfo,$url);
	$pdf->SetTextColor(0,0,0);
	$pdf->SetFont('','B');
}
$d = getDate();
$dateInfo = 'DATE: '.$d['mon'].'/'.$d['mday'].'/'.$d['year'];
$pdf->Cell(0,10,$dateInfo,0,1,'L');
$pdf->Cell(0,10,'QUOTE',0,1,'C');
$pdf->Cell(0,10,'Quote To:',0,1,'L');


foreach($jobs_xml->job as $job) {
	if ($job['id'] == $jobId) {
		$customerId = $job['customerId'];
		//echo "customer id: " . $customerId ."\n";
		$xpathQuery = "//customer[@id='".$customerId."']";
		$result = $customers_xml->xpath($xpathQuery);
		$customerName = $result[0]->last.', '.$result[0]->first;
		$pdf->Cell(0,10,$customerName,0,1,'L');
		$typeId = $job['typeId'];
		//echo "type id: " . $typeId ."\n";
		$xpathQuery = "//type[@id='".$typeId."']";
		$result = $types_xml->xpath($xpathQuery);
		$typeName = $result[0]->name;
		//echo "type name: " . $typeName ."\n";
		//echo "description: " . $job->description . "\n";
		$jobTypeInfo = 'job type: '.$typeName;
		$pdf->Cell(0,10,$jobTypeInfo,0,1,'L');
		$descriptionInfo = 'description: '.$job->description;
		$pdf->Cell(0,10,$descriptionInfo,0,1,'L');
		//float GetX()
		$x = $pdf->GetX();
		$y = $pdf->GetY();
		$x2 = $x + 200;
		$y2 = $y;
		//Line(float x1, float y1, float x2, float y2)
		$pdf->Line($x, $y, $x2, $y2);
		$pdf->Cell(0,10,'Options',0,1,'L');
		$options = $job->options;
		//$header=array('Item','SKU','Attributes','Description','Unit $','Qty','Price');
		$header=array('Item','SKU','Attributes','Description','Unit $','Qty','Price $');
		foreach($options->option as $option) {
			$optionCost = (float) 0;
			$optionId = $option['id'];
			//echo "option id: " . $option['id'] ."\n";
			//echo "option id: " . $optionId ."\n";
			$xpathQuery = "//option[@id='".$optionId."']";
			$result = $options_xml->xpath($xpathQuery);
			$optionName = $result[0]->name;
			//echo "option name: " . $optionName ."\n";
			$optionInfo = 'option: '.$optionName;
			$pdf->SetFont('Arial','B',16);
			$pdf->Cell(0,10,$optionInfo,0,1,'L');
			//$pdf->ezText("<table><thead><tr><th>Item Name</th><th>SKU</th><th>Attributes</th><th>Description</th><th>Unit Price</th><th>Quantity</th><th>Price</th></tr></thead><tbody>",50);
			//Column titles
			//$header=array('Item Name','SKU','Attributes','Description','Unit Price','Quantity','Price');
			//$header=array('Item','SKU','Attributes','Description','Unit $','Qty','Price');
			$partsTable = array();
			$rowNumber = 0;
			$parts = $option->parts;
			foreach($parts->part as $part) {
				$partId = $part['id'];
				//echo "part id: " . $part['id'] ."\n";
				//echo "part id: " . $partId ."\n";
				$xpathQuery = "//part[@id='".$partId."']";
				$result = $parts_xml->xpath($xpathQuery);
				$partName = $result[0]->name;
				//echo "part name: " . $partName ."\n";
				$quantity = $part->quantity;
				if (strlen($quantity) > 0) {
					//echo "quantity: " . $quantity;
				} else {
					$quantity = 1;
				}
				$supplier = $result[0]->supplier;
				$attributes = $supplier->attributes;
				if (strlen($attributes) > 0) {
					//echo "attributes: " . $attributes;
				}
				$sku = $part->sku;
				if (strlen($sku) > 0) {
					//echo "override sku: " . $sku;
				} else {
					$sku = $supplier->sku;
					if (strlen($sku) > 0) {
						//echo "sku: " . $sku;
					}
				}
				$partDescription = $supplier->description;
				if (strlen($partDescription) > 0) {
					//echo "partDescription: " . $partDescription;
				}
				$partCost = $supplier->cost;
				//for debug only
				//if (strlen($partCost) > 0) {
				//if ($partId == 29 && strlen($partCost) > 0) {
					// e.g. 0.5
				//	echo "partCost: " . $partCost;
				//}
				$unitCost = (float) $partCost;  // the adjusted cost per unit
				//if ($partId == 29) {
					// e.g. 0.5
				//	echo "unitCost: " . $unitCost;
				//}
				$discount = $part->discount;
				$discountAmount = 0;
				if (strlen($discount) > 0) {
					//echo "discount: " . $discount;
					$discountAmount = (float) $discount;
				} 
				//if ($partId == 29) {
					// e.g. 0
					//echo "discountAmount: " . $discountAmount;
				//}
				if ($discountAmount < 1) {
					//if ($partId == 29) {
						// e.g. 0.5
						//echo "unitCost: " . $unitCost;
					//}
					$unitCost = $unitCost - $discountAmount*$partCost;
					//if ($partId == 29) {
						// e.g. 0.5
						//echo "unitCost: ".$unitCost." discountAmount ".$discountAmount;
					//}
				} else {
					$unitCost = $unitCost - $discountAmount;
				}
				//if ($partId == 29) {
					// e.g. 0.5
					//echo "unitCost: " . $unitCost;
				//}
				$surcharge = $part->surcharge;
				$surchargeAmount = 0;
				if (strlen($surcharge) > 0) {
					//echo "surcharge: " . $surcharge;
					$surchargeAmount = (float) $surcharge;
				} 
				if ($surchargeAmount < 1) {
					$unitCost = $unitCost +	$surchargeAmount*$partCost;
				} else {
					$unitCost = $unitCost + $surchargeAmount;
				}
				//for debug only
				//if ($partId == 29) {
					// e.g. 0.5
				//	echo "unitCost: " . $unitCost;
				//}
				
				//echo "unitCost: " . $unitCost;
				$cost = (float) $quantity*$unitCost;
				//for debug only
				//if ($partId == 29) {
					// e.g. 12.5
				//	echo "unitCost: ".$unitCost." quantity ".$quantity." cost ".$cost;
				//}
			$row = array();
			//$row[0] = $partName;
			$row[0] = truncateText($partName, 10);
			//$row[1] = $sku;
			$row[1] = truncateText($sku, 10);
			//$row[2] = $attributes;
			$row[2] = truncateText($attributes, 15);
			//$row[3] = $partDescription;
			$row[3] = truncateText($partDescription, 30);
			$row[4] = $unitCost;
			$row[5] = $quantity;
			$row[6] = $cost;
			$partsTable[$rowNumber++] = $row;	
				//echo "cost: " . $cost;
				$optionCost += $cost;
			}
			//echo "optionCost: " . $optionCost;
			$row = array();
			$row[0] = '';
			$row[1] = '';
			$row[2] = '';
			$row[3] = '';
			//$row[4] = '';
			//$row[5] = 'Total: ';
			$row[4] = '0';
			$row[5] = '0';
			$row[6] = $optionCost;
			$partsTable[$rowNumber++] = $row;
			//$pdf->FancyTable($header,$partsTable);
			$pdf->SetFontSize(12);
			$pdf->OptionTable($header,$partsTable);
			$pdf->Ln();
			$pdf->setX(10);
		}
	}
}

$pdf->Ln();
$bulletChar = '* ';
$policies = $account_xml->policies;
foreach ($policies->children() as $policy)
{
 	$policyType = $policy['type'];
	$pdf->SetFont('','B');
	$pdf->Ln();
	$pdf->Cell(0,10,$policyType,0,1,'L');
	$pdf->SetFont('','');
	//0x95	0x2022	#BULLET
	 foreach ($policy->children() as $bullet)
	{
			$pdf->SetFontSize(20);
		$pdf->Cell(20,10,$bulletChar,0,0,'L');
			$pdf->SetFontSize(12);
		//$pdf->MultiCell(0,10,$bullet,0,1,'L');
		$pdf->MultiCell(0,5,$bullet,0,1,'L');
	}
}

$pdf->Ln();

$pdf->Write(5,'Quote Engine By: ');
//Then put a blue underlined link
$pdf->SetTextColor(0,0,255);
$pdf->SetFont('','U');
$pdf->Write(5,'www.collogistics.com','http://www.collogistics.com');

//$pdf->ezStream();
$pdf->Output();

/*
API notes
MakeFont(string fontfile, string afmfile [, string enc [, array patch [, string type]]])
default enc is cp1252

Family font. It can be either a name defined by AddFont() or one of the standard
families (case insensitive):

    * Courier (fixed-width)
    * Helvetica or Arial (synonymous; sans serif)
    * Times (serif)
    * Symbol (symbolic)
    * ZapfDingbats (symbolic)

It is also possible to pass an empty string. In that case, the current family
is retained. 

Font style. Possible values are (case insensitive):

    * empty string: regular
    * B: bold
    * I: italic
    * U: underline

or any combination. The default value is regular. Bold and italic styles do not
apply to Symbol and ZapfDingbats. 

Font size in points.
The default value is the current size. If no size has been specified since the
beginning of the document, the value taken is 12. 

Cell(float w [, float h [, string txt [, mixed border [, int ln [, string align
[, boolean fill [, mixed link]]]]]]])
w Cell width. If 0, the cell extends up to the right margin.(in cm) 
h Cell height. Default value: 0
border 0 no 1 frame OR LTRB
ln - position after 0 (right), 1 (start new line), 2 below
align L | C | R
fill (true shows background)

MultiCell(float w, float h, string txt [, mixed border [, string align [, boolean fill]]])
(above supports \n)

Write(float h, string txt [, mixed link])

*/
?> 


