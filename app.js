//Reference:: http://ds.data.jma.go.jp/mscweb/data/himawari/sat_img.php?area=se4

const http = require('http');
const fs = require('fs');

const wallpaper = require('wallpaper');

const resourceProvider = 'http://ds.data.jma.go.jp/mscweb/data/himawari/';

const writeToPath = '';

const writeToFile = 'CurrentHimawariImage.jpg';

const areas = [
	'fd_', /*Full Disk*/
	'aus', /*Australia*/
	'ca1', /*Central Asia*/
	'nzl', /*New Zealand*/
	'pi1', /*Pacific Islands 1*/
	'pi2', /*Pacific Islands 2*/
	'pi3', /*Pacific Islands 3*/
	'pi4', /*Pacific Islands 4*/
	'pi5', /*Pacific Islands 5*/
	'pi6', /*Pacific Islands 6*/
	'pi7', /*Pacific Islands 7*/
	'pi8', /*Pacific Islands 8*/
	'pi9', /*Pacific Islands 9*/
	'pia', /*Pacific Islands 10*/
	'se1', /*Southeast Asia 1*/
	'se2', /*Southeast Asia 2*/
	'se3', /*Southeast Asia 3*/
	'se4', /*South Asia*/
	'ha1', /*Hi-res Asia 1*/
	'ha2', /*Hi-res Asia 2*/
	'ha3', /*Hi-res Asia 3*/
	'ha4', /*Hi-res Asia 4*/
	'ha5', /*Hi-res Asia 5*/
	'ha6', /*Hi-res Asia 6*/
	'hp1', /*Hi-res Pacific Islands 1*/
	'hp2', /*Hi-res Pacific Islands 2*/
	'hp3', /*Hi-res Pacific Islands 3*/
	'jpn', /*Japan area*/	
];

const bands = [
	'b13', /*B13 Infrared*/
	'b03', /*B03 Visible*/
	'b08', /*B08 WaterVapour*/
	'b07', /*B07 Short Wave Infrared*/
	'dms', /*Day Microphysics RGB*/
	'ngt', /*Night Microphysics RGB*/
	'dst', /*Dust RGB*/
	'arm', /*Airmass RGB*/
	'dsl', /*Day Snow-Fog RGB*/
	'dnc', /*Natural Color RGB*/
	'tre', /*True Color RGB (Enhanced)*/
	'trm', /*True Color Reproduction Image*/
	'cve', /*Day Convective Storm RGB*/
	'snd', /*Sandwitch*/
	'vir', /*B03 combined with B13*/
	'irv', /*B03 and B13 at night*/ 
	'hrp'  /*Heavy rainfall potential areas*/
];

const getImageLocationFrom = (area, band) => {
	const time = getCurrentUTCDateCode();
	return resourceProvider+"img/" + area + "/" + area + "_" + band + "_" + time + ".jpg";
};

const getCurrentUTCDateCode = () => {
	//get time twentry mins before current time
	const currentDate = new Date(new Date().getTime() - (20 * 60 * 1000));
	const currentHour = padTimeNumeric(currentDate.getUTCHours());
	const currentMinute = padTimeNumeric(convertLowerBoundTensMultiple(currentDate.getUTCMinutes()));
	return currentHour+currentMinute;
};

const convertLowerBoundTensMultiple = (number) => {
	if (number < 10) return 0;
	if ((number % 10) == 0) return number;
	const numberAfterLastDigit = parseInt(number/10);
	return numberAfterLastDigit * 10; 
}

const padTimeNumeric = (number)=>{
	const numberString = String(number);
	if (number < 10) return '0' + numberString;
	return numberString; 
}

const getResource = () => {
	const writeToFileWithPath = writeToPath+writeToFile;
	const writableFileStream = fs.createWriteStream(writeToFileWithPath);
	const imageLocation = getImageLocationFrom('se4', 'hrp');
	console.log('Fetcing resource from '+imageLocation);
	http.request(imageLocation, (res)=>{
		res.pipe(writableFileStream);

	}).end();
	writableFileStream.on('finish', ()=>{
		wallpaper.set(writeToFileWithPath).then(()=>{
			console.log('Updated Wallpaper');
		});
	});
}	
getResource();	