// Created by: Quinn du Piesanie
// Implementation of sfmPipeline.h
#include "sfmPipeline.h"


SfmPipeline::SfmPipeline(string input_file_name)
{
	file_name = input_file_name;
}

bool SfmPipeline::createImageListings()
{

	cout << "--------------------------------------" << endl;
	cout << "Beginning Image Listing Process..." << endl;
	cout << "--------------------------------------" << endl;

	// Create Directory with the same name as the passed file_name
	string dir_path = getCurrentDir() + "imageMatches\\" + file_name;
	if (!CreateDirectory(dir_path.c_str(), NULL))
		if (ERROR_ALREADY_EXISTS != GetLastError()) {
			cerr << "ERROR: Could not create directory." << endl;
			return false;
		}


	//Create a parameter string which will be appended with execution of openMVG_main_SfMInit_ImageListing
	string parameter_line = "";

	/*Specify the file where a database of known intrinsics is stored. 
	Not useful for Intraoral Camera but good practice to have. */
	parameter_line = "-d " + getCurrentDir() + "sensor_width_camera_database.txt ";

	//Intrinsics Matrix K is specified here.
	parameter_line = parameter_line + "-k " + to_string(f) + ";0;" + to_string(x_half) +
		";0;" + to_string(f) + ";" + to_string(y_half) + ";0;0;1 ";

	//Parameter for focal length in terms of pixels.
	//parameter_line = parameter_line + "-f 29866.66 ";

	//Specify input file that contains the images
	parameter_line = parameter_line + "-i " + getCurrentDir() + "imageData\\" + file_name + "\\ ";

	//Specify the output file to store computed data
	parameter_line = parameter_line + "-o " + getCurrentDir() + "imageMatches\\" + file_name + "\\";

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_SfMInit_ImageListing", parameter_line);

	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Image Listing Complete!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Image Listing Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;

}

bool SfmPipeline::computeFeatures()
{

	cout << "--------------------------------------" << endl;
	cout << "Beginning Image Feature Process!" << endl;
	cout << "--------------------------------------" << endl;

	/* Specify input files of previous computed step and output files for
	 where the newly computed data should be stored. */
	string input_path, output_path;
	input_path = getCurrentDir() + "imageMatches\\" + file_name + "\\sfm_data.json";
	output_path = getCurrentDir() + "imageMatches\\" + file_name + "\\";

	//Include the input and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -o " + output_path 
	//The quality of the descriptor (ULTRA takes the longest but produces the best quality)
		+ " -p ULTRA";

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_ComputeFeatures", parameter_line);

	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Image Features Computed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Image Feature Computing Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

bool SfmPipeline::computeMatches()
{

	cout << "--------------------------------------" << endl;
	cout << "Beginning Image Matching Process!" << endl;
	cout << "--------------------------------------" << endl;

	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored. */
	string input_path, output_path;
	input_path = getCurrentDir() + "imageMatches\\" + file_name + "\\sfm_data.json";
	output_path = getCurrentDir() + "imageMatches\\" + file_name + "\\";

	//Include the input and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -o " + output_path 
	// Ratio of match accuracy. Lower = less noise
		+ " -r .4 ";

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_ComputeMatches", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Image Matching Complete!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Image Matching Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

bool SfmPipeline::computeIncrementalSfm()
{
	cout << "--------------------------------------" << endl;
	cout << "Beginning SFM Process!" << endl;
	cout << "--------------------------------------" << endl;

	// Create Directory where the final reconstruction will be stored.
	string dir_path = getCurrentDir() + "sfmReconstruction\\" + file_name;
	if (!CreateDirectory(dir_path.c_str(), NULL))
		if (ERROR_ALREADY_EXISTS != GetLastError()) {
			cerr << "ERROR: Could not create directory." << endl;
			return false;
		}

	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored,
	also Specify the file where the match data is stored.*/
	string input_path, output_path, match_path;
	input_path = getCurrentDir() + "imageMatches\\" + file_name + "\\sfm_data.json";
	output_path = getCurrentDir() + "sfmReconstruction\\" + file_name + "\\";
	match_path = getCurrentDir() + "imageMatches\\" + file_name + "\\";;

	//Include the input, match and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -m " + match_path + " -o " + output_path;

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_IncrementalSfM", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Incremental SFM Complete!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Incremental SFM Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

bool SfmPipeline::computeDataColor()
{
	cout << "--------------------------------------" << endl;
	cout << "Beginning Data Color Computation!" << endl;
	cout << "--------------------------------------" << endl;

	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored. */
	string input_path, output_path;
	input_path = getCurrentDir() + "sfmReconstruction\\" + file_name + "\\sfm_data.bin";
	output_path = getCurrentDir() + "sfmReconstruction\\" + file_name + "\\sfm_data_color.ply";

	//Include the input and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -o " + output_path;

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_ComputeSfM_DataColor", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Data Colors Computed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Data Color Computing Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

//Fetch current directory the Executable is located in.
string SfmPipeline::getCurrentDir()
{
	char buffer[MAX_PATH];
	GetModuleFileName(NULL, buffer, MAX_PATH);
	string path = string(buffer);
	path = path.substr(0, path.find_last_of("\\/"));
	return (path + "\\");
}

//Code use to command-line execute external Executables with given parameters.
bool SfmPipeline::executeExternal(string name, string parameters)
{
	string _name = name + ".exe";
	string _path = getCurrentDir() + "openMVG\\bin\\";
	string cmd = _path + _name + " " + parameters;
	return system(cmd.c_str());
}
