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

function RightPtExpansion(Right) {
	// Right - Right part of the Plaintext {Ri} (32 bits)
	// Expanding The RPT from 32 to 48 bits.
	var ExpansionTable =
	[
		32,   01,   02,   03,   04,   05,
		04,   05,   06,   07,   08,   09,
		08,   09,   10,   11,   12,   13,
		12,   13,   14,   15,   16,   17,
		16,   17,   18,   19,   20,   21,
		20,   21,   22,   23,   24,   25,
		24,   25,   26,   27,   28,   29,
		28,   29,   30,   31,   32,   01
	];
	var ExpandedText = [];
	for (var i = 0; i < ExpansionTable.length; i++) {
		var text = ExpandedText[ExpansionTable[i] - 1];
		ExpandedText.push(text);
	}
	return ExpandedText;
}

function Permute(RightPT) {
	// RightPT - Right Plaintext (of 32 bits)
	var Permutation =
	[
		16,  07,  20,  21,
		29,  12,  28,  17,
		01,  15,  23,  26,
		05,  18,  31,  10,
		02,  08,  24,  14,
		32,  27,  03,  09,
		19,  13,  30,  06,
		22,  11,  04,  25
	];

	var Modified = [];
	for (var i = 0; i < Permutation.length; i++) {
		Modified.push(Permutation[RightPT[i] - 1]);
	}
	return Modified;
}

function Round(Plaintext, Key) {
	// Left - Left Part of the Plaintext
	// Right - Right Part of the Plaintext
	// Key - Key of the Round (48 bits)
	var Left = [], Right = [];
	for (var i = 0; i < Plaintext.length; i++) {
		if(i < Plaintext.length/2)
			Left.push(Plaintext[i]);
		else
			Right.push(Plaintext[i]);
	}
	ExpandedRPT = RightPtExpansion(Right);
	for (var i = 0; i < ExpandedRPT.length; i++) {
		ExpandedRPT[i] = ExpandedRPT ^ Key[i];
	}
	// TODO: Sbox Compression step
	// CompressRPT = Sbox(ExpandedRPT)
	CompressRPT = Permute(CompressRPT)
	for (var i = 0; i < CompressRPT.length; i++) {
		CompressRPT[i] = CompressRPT ^ Left[i];
	}
	Left = Right;
	var ModifiedPT = [];
	ModifiedPT = Left.concat(CompressRPT);
	return ModifiedPT;
}

function Final_Permutation(Text) {
	// Swap two blocks (Left, Right) and apply final permutation
	var Left = [], Right = [];
	var Modified = [];
	for (var i = 0; i < Text.length; i++) {
		// Swapping ;) Left nd Right
		if(i < Text.length/2)
			Right.push(Text[i]);
		else
			Left.push(Text[i]);
	}
	Modified = Right.concat(Left);
}

// Sequence
// 1. Initial Permu..
// 2. 16 Rounds are performed on Plaintext with corresponding key of each Round.
// 3. Swap the left right parts after 16th round.
// 4. Do Final Permu..
var Plaintext = [0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,1,0,1,1,0,0,1,1,1,1,0,0,0,1,0,0,1,1,0,1,0,1,0,1,1,1,1,0,0,1,1,0,1,1,1,1,0,1,1,1,1];
Plaintext = Initial_Permutation(Plaintext)
console.log(Plaintext);