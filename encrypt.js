// Refering - http://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm

function Initial_Permutation(Plaintext) {
	// Plaintext is 64 bits long
	var InitialPermTable = 
	[
		58,  50,  42,  34,  26,  18,  10,  2,
		60,  52,  44,  36,  28,  20,  12,  4,
		62,  54,  46,  38,  30,  22,  14,  6,
		64,  56,  48,  40,  32,  24,  16,  8,
		57,  49,  41,  33,  25,  17,   9,  1,
		59,  51,  43,  35,  27,  19,  11,  3,
		61,  53,  45,  37,  29,  21,  13,  5,
		63,  55,  47,  39,  31,  23,  15,  7
	];
	var Modified = [];
	for (var i = 0; i < Plaintext.length; i++) {
		Modified.push(Plaintext[InitialPermTable[i] - 1])
	}
	return Modified;
}

function keyGen(key) {
	// Key is 64 bits long
	// This function generates C0 and D0
	var ParityDropTable =
	[
		57,   49,   41,   33,   25,   17,   09,
		01,   58,   50,   42,   34,   26,   18,
		10,   02,   59,   51,   43,   35,   27,
		19,   11,   03,   60,   52,   44,   36,
		63,   55,   47,   39,   31,   23,   15,
		07,   62,   54,   46,   38,   30,   22,
		14,   06,   61,   53,   45,   37,   29,
		21,   13,   05,   28,   20,   12,   04
	];
	var Modified = [];
	for (var i = 0; i < ParityDropTable.length; i++) {
		var key_element = key[ParityDropTable[i] - 1];
		Modified.push(key_element);
	}
	return Modified;
}

function RoundKey(CD, num) {
	// CD - CD of Previous Round (of 56 bits)
	// num - Round Number
	// Returns the Key for the Round(Before Compression)
	next_CD = [];
	if(num == 1 || num == 2 || num == 9 || num == 16)
	{
		// shift by 1
		for (var i = 1; i < CD.length; i++) {
			next_CD.push(CD[i]);
		}
		next_CD.push(CD[0]);
	}
	else
	{
		// shift by 2
		for (var i = 2; i < CD.length; i++) {
			next_CD.push(CD[i]);
		}
		next_CD.push(CD[0], CD[1]);
	}
	return next_CD;
}

function RoundKeyCompress(CD) {
	// CD - CD of the Round (of 56 bits) 
	// Compress to 48 bits Key
	var KeyCompressionTable =
	[
		14,   17,   11,   24,   01,   05,
		03,   28,   15,   06,   21,   10,
		23,   19,   12,   04,   26,   08,
		16,   07,   27,   20,   13,   02,
		41,   52,   31,   37,   47,   55,
		30,   40,   51,   45,   33,   48,
		44,   49,   39,   56,   34,   53,
		46,   42,   50,   36,   29,   32
	];
	var Modified = [];
	for (var i = 0; i < KeyCompressionTable.length; i++) {
		var key_element = CD[KeyCompressionTable[i] - 1];
		Modified.push(key_element);
	}
	return Modified;
}

var Plaintext = [0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,1,1,1,0,1,1,1,1];
Plaintext = Initial_Permutation(Plaintext)
console.log(Plaintext);