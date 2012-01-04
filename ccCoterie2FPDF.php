<?php
//echo "here";
require ('fpdf.php');

/*
ccCoterie2FPDF.php
tjs 091216

file version 1.01 

release version 1.07
*/

/*
e.g. of data content:
<coterie>
<person id="1" surname="Soucy" name="Tom">
<emails>
<email>tandmsoucy@verizon.net</email>
</emails>
<phones>
<phone type="home" number="(781) 599-8014" />
<phone type="mobile" number="(781) 608-6840" />
</phones>
<address city="Lynn" state="MA" zip="01904">
<street>
3 Harris Rd.
</street>
</address>
<links>
<link type="spouse" refId="3" />
<link type="proprietor" refId="2" />
</links>
</person>
<entity id="2" name="Collogistics">
<emails>
<email>support@collogistics.com</email>
</emails>
<phones>
<phone type="home" number="(781) 599-8014" />
<phone type="mobile" number="(781) 608-6840" />
</phones>
<address city="Lynn" state="MA" zip="01904">
<street>
3 Harris Rd.
</street>
</address>
<links>
<link type="employer" refId="1" />
</links>
</entity>
</coterie>

see also http://www.fpdf.org/
*/

//function trimNewLine($str) {
//	return substr($str, 0, strlen($str) - 1);
//}

$lastName = "AAAAAA";

//$pdf=new PDF();
$pdf=new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);

$account = $_GET['account'];

if (strlen($account) > 0) {
	//echo $account;
} else {
	echo "No account";
}

//todo date, url, 2nd street
//todo link support
//todo header/footer page numbering
//todo skip extra page if count less than two page threshold
class Entity {
	public $_id;
	public $_name;
	public $_surname;
	public $_emails;
	public $_phones;
	public $_streets;
	public $_city;
	public $_state;
	public $_zip;
	
	public function __construct($id, $name, $emails, $phones, $streets, $city, $state, $zip) {
		$this->_id = $id;
		$this->_name = $name;
		$this->_emails = $emails;
		$this->_phones = $phones;
		$this->_streets = $streets;
		$this->_city = $city;
		$this->_state = $state;
		$this->_zip = $zip;
	}
	
	public function getName() {
		return $this->_name;
	}

	public function getEmails() {
		$emails = array();
		foreach ( $this->_emails as $email) {
			$emails[] = $email;
		}
		return $emails;
	}

	public function getPhones() {
		$phones = array();
		foreach( $this->_phones as $phoneType => $phoneNumber) {
			$phones[] = $phoneType.": ".$phoneNumber;
		}
		return $phones;
	}

	public function getStreet() {
		foreach ( $this->_streets as $street) {
			return $street;
		}
	}
/*
	public function getCityStateZip() {
		//return $this->_city.", ".$this->_state." X ".$this->_zip;
		return (string) $this->_city.", ".(string) $this->_state." X ".(string) $this->_zip;
	}*/
	public function getCity() {
		return $this->_city;
	}
	public function getState() {
		return $this->_state;
	}
	public function getZip() {
		return $this->_zip;
	}
	/*
	public function getInfo() {
		$info = array();
		//$info[] = $this->getName();
		//$info[] = $this->getCity();
		$info[] = $this->_name;
		$info[] = $this->_city;
		return $info;
	}*/
	
	public function showDetails() {
		echo "entity ".$this->_name." id ".$this->_id."\n";
		echo "emails:\n";
		//print_r($emailList);
		foreach ( $this->_emails as $email) {
			echo $email;
		}
		echo "phones:\n";
		//print_r($phoneList);
		foreach( $this->_phones as $phoneType => $phoneNumber) {
			echo $phoneType.": ".$phoneNumber;
		}
		echo "address:\n";
		//print_r($streetList);
		foreach ( $this->_streets as $street) {
			echo $street;
		}
		echo $this->_city.", ".$this->_state." ".$this->_zip."\n";		
	}
	
	    /* This is the static comparing function: */
    static function cmp_obj($a, $b)
    {
        $al = strtolower($a->getName());
        $bl = strtolower($b->getName());
        if ($al == $bl) {
            return 0;
        }
        return ($al > $bl) ? +1 : -1;
    }

}

class Person extends Entity {
	public $_surname;
	public function __construct($id, $name, $surname, $emails, $phones, $streets, $city, $state, $zip) {
		$this->_id = $id;
		$this->_name = $name;
		$this->_surname = $surname;
		$this->_emails = $emails;
		$this->_phones = $phones;
		$this->_streets = $streets;
		$this->_city = $city;
		$this->_state = $state;
		$this->_zip = $zip;
	}
	public function getName() {
		return $this->_surname.", ".$this->_name;
	}
	public function showDetails() {
		echo "person ".$this->_name." ".$this->_surname." id ".$this->_id."\n";
		echo "emails:\n";
		//print_r($emailList);
		foreach ( $this->_emails as $email) {
			echo $email;
		}
		echo "phones:\n";
		//print_r($phoneList);
		foreach( $this->_phones as $phoneType => $phoneNumber) {
			echo $phoneType.": ".$phoneNumber;
		}
		echo "address:\n";
		//print_r($streetList);
		foreach ( $this->_streets as $street) {
			echo $street;
		}
		echo $this->_city.", ".$this->_state." ".$this->_zip."\n";		
	}
}

//function outputCoterieMember($member) {
	/*
To add a frame, we would do this:
$pdf->Cell(40,10,'Hello World !',1);
To add a new cell next to it with centered text and go to the next line, we would do:
$pdf->Cell(60,10,'Powered by FPDF.',0,1,'C');
	
	*/
	/*
API Notes
Cell(float w [, float h [, string txt [, mixed border [, int ln [, string align [, boolean fill [, mixed link]]]]]]])
w Cell width. If 0, the cell extends up to the right margin. 
h Cell height. Default value: 0. 
txt String to print. Default value: empty string. 
border:
	* 0: no border
	* 1: frame
OR
    * L: left
    * T: top
    * R: right
    * B: bottom
ln    after call position:
    * 0: to the right
    * 1: to the beginning of the next line
    * 2: below
    Putting 1 is equivalent to putting 0 and calling Ln() just after. Default value: 0. 
align
    * L or empty string: left align (default value)
    * C: center
    * R: right align
fill   Indicates if the cell background must be painted (true) or transparent (false). Default value: false.
URL or identifier returned by AddLink(). 
	*/
function outputCoterieMember($pdf, $member) {
	global $lastName;
	$memberName = $member->getName();
	$lastNameUC = strtoupper($lastName);
	$lastStartChar = $lastNameUC[0];
	$memberNameUC = strtoupper($memberName);
	$currentStartChar = $memberNameUC[0];
	if ($currentStartChar > $lastStartChar) {
		$pdf->AddPage();
		$lastName = $memberName;
	}
	
	$pdf->SetFont('Arial','B',16);

	//$pdf->Cell(0,20,$member->getName(),0,1,'L');
	//$pdf->Cell(0,20,$member->getName(),1);
	$pdf->Cell(0,20,$member->getName(),'B');
	//$pdf->SetFont('Arial','B',12); //P, R
	$pdf->SetFont('Arial','',12);

	$phones = $member->getPhones();
	$phoneCount = count($phones);
	$phoneLine = "phone:_______________";
	switch ($phoneCount) {
		case 1:
	$phoneLine = sprintf("%s", $phones[0]);
		break;
		case 2:
	$phoneLine = sprintf("%s %s", $phones[0], $phones[1]);
		break;
		case 3:
	$phoneLine = sprintf("%s %s %s", $phones[0], $phones[1], $phones[2]);
		break;
		default:
		case 0:
		break;
	}
	$pdf->Cell(0,5,$phoneLine,0,1,'R');
	$pdf->Cell(0,5,$member->getStreet(),0,1,'R');
	$cityStateZip = sprintf("%s, %s %s", $member->getCity(), $member->getState(), $member->getZip());
	$pdf->Cell(0,5,$cityStateZip,0,1,'R');
	$emails = $member->getEmails();
	$emailCount = count($emails);
	$emailLine = "email:_________________";
	switch ($emailCount) {
		case 1:
	$emailLine = sprintf("%s", $emails[0]);
		break;
		case 2:
	$emailLine = sprintf("%s %s", $emails[0], $emails[1]);
		break;
		case 3:
	$emailLine = sprintf("%s %s %s", $emails[0], $emails[1], $emails[2]);
		break;
		default:
		case 0:
		break;
	}
		$pdf->Cell(0,5,$emailLine,0,1,'R');

	//foreach ($emails as $email) {
	//	$pdf->Cell(0,5,$email,0,1,'R');
	//}	
}
// set name of XML file
$file = "xml/".$account."/coterie.xml";

// load file
$coterie_xml = simplexml_load_file($file) or die ("Unable to load XML file!");

// access XML person data
$people = array();
foreach($coterie_xml->person as $person) {
	$personId = $person['id'];
	$personName = $person['name'];
	$personSurName = $person['surname'];
	$emails = $person->emails;
	$emailList = array();
	foreach($emails->email as $email) {
		$emailList[] = $email;
	}
	$phones = $person->phones;
	$phoneList = array();
	foreach($phones->phone as $phone) {
		$phoneType = $phone['type'];
		//echo "phone type: ".$phoneType;
		$phoneNumber = $phone['number'];
		//echo "phone number: ".$phoneNumber;
		$phoneList[(string) $phoneType] = $phoneNumber;
		//echo "phone number: ".$phoneList[$phoneType];
	}
	//echo count($phoneList);
	$address = $person->address;
	$streetList = array();
	foreach($address->street as $street) {
		$streetList[] = $street;
	}
	//$city = $address['city'];
	//$city = (string) $address['city'];
	$city = $address['city'];
	$cityStr = $city;
	$state = $address['state'];
	$zip = $address['zip'];
		//echo "city ".$city;

	$p = new Person($personId, $personName, $personSurName, $emailList, $phoneList, $streetList, $cityStr, $state, $zip);
	$people[] = $p;
}

// access XML entity data
$entities = array();
foreach($coterie_xml->entity as $entity) {
	$entityId = $entity['id'];
	$entityName = $entity['name'];
	$emails = $entity->emails;
	$emailList = array();
	foreach($emails->email as $email) {
		$emailList[] = $email;
	}
	$phones = $entity->phones;
	$phoneList = array();
	foreach($phones->phone as $phone) {
		$phoneType = $phone['type'];
		//echo "phone type: ".$phoneType;
		$phoneNumber = $phone['number'];
		//echo "phone number: ".$phoneNumber;
		$phoneList[(string) $phoneType] = $phoneNumber;
		//echo "phone number: ".$phoneList[$phoneType];
	}
	//echo count($phoneList);
	$address = $entity->address;
	$streetList = array();
	foreach($address->street as $street) {
		$streetList[] = $street;
	}
	$city = $address['city'];
	$state = $address['state'];
	$zip = $address['zip'];
	$e = new Entity($entityId, $entityName, $emailList, $phoneList, $streetList, $city, $state, $zip);
	$entities[] = $e;
}
/*
//sort arrays
usort($people, array("Person", "cmp_obj"));
foreach($people as $p) {
	//$p->showDetails();
	outputCoterieMember($pdf, $p);
}
usort($entities, array("Entity", "cmp_obj"));
foreach($entities as $e) {
	//$e->showDetails();
		outputCoterieMember($pdf, $e);
}
*/
//merge arrays
$peopleEntities = array_merge($people, $entities);
usort($peopleEntities, array("Entity", "cmp_obj"));
foreach($peopleEntities as $pe) {
	outputCoterieMember($pdf, $pe);
}


$pdf->Output();

?> 


