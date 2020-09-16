// Created by: Quinn du Piesanie
// Implementation of sfmPipeline.h

#include "SfmPipeline.h"

SfmPipeline::SfmPipeline(string input_file_name)
{
	file_name = input_file_name;
}

//Getter for the file_name
std::string SfmPipeline::getFileName(){
		return file_name;
	}

bool SfmPipeline::createImageListings()
{

	cout << "--------------------------------------" << endl;
	cout << "Beginning Image Listing Process..." << endl;
	cout << "--------------------------------------" << endl;

	// Create Directory with the same name as the passed file_name (WINDOWS)
	/*
	string dir_path = getCurrentDir() + "imageMatches\\" + file_name;
	if (!CreateDirectory(dir_path.c_str(), NULL))
		if (ERROR_ALREADY_EXISTS != GetLastError()) {
			cerr << "ERROR: Could not create directory." << endl;
			return false;
		}
	*/


	//Create a parameter string which will be appended with execution of openMVG_main_SfMInit_ImageListing
	string parameter_line = "";

	/*Specify the file where a database of known intrinsics is stored.
	Not useful for Intraoral Camera but good practice to have. */
	if (Helper::fileExists("../../sensor_width_camera_database.txt"))
	parameter_line = parameter_line + " -d " + "../../sensor_width_camera_database.txt ";
	else
	cout << "Could not find database file sensor_width_camera_database.txt, skipping inclusion..." << endl;

	//Intrinsics Matrix K is specified here.
	//parameter_line = parameter_line + "-k " +	f + ";0;" +  "320" + ";0;" + f + ";" +  "240" + ";0;0;1 ";

	//Parameter for focal length in terms of pixels.
	parameter_line = parameter_line + "-f " + f + " -c " + camera_model + " "   ;

	//Specify input file that contains the images
	parameter_line = parameter_line + " -i " +  "../../imageData/" + file_name;

	//Specify the output file to store computed data
	parameter_line = parameter_line + " -o " +  "imageMatches";

//	parameter_line = parameter_line + " -k 800"+';'+"0"+';'+"320"+';'+"0"+';'+"800"+';'+"240"+';'+"0"+';'+"0"+';'+"1";

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
	input_path =  "imageMatches/sfm_data.json";
	output_path =  "imageMatches";

	//Include the input and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -o " + output_path
	//The quality of the descriptor (ULTRA takes the longest but produces the best quality)
		+ " -p " + describer_quality
	//Force Recompile
		+ " -f " + force_feature
	//The Method used for the describer
		+ " -m " + describer_method;

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
	input_path =  "imageMatches/sfm_data.json";
	output_path =  "imageMatches";

	//Include the input and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -o " + output_path
	// Ratio of match accuracy. Lower = less noise
		+ " -r " + ratio + " "
	// Force Recompile
		+ " -f " + force_matches
	// Set Geometric Model to use
		+ " -g " + geometric_model
	// Set Matching method
		+ " -n " + nearest_matching;

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

	// Create Directory where the final reconstruction will be stored. (WINDOWS)
	/*
	string dir_path = getCurrentDir() + "sfmReconstruction\\" + file_name;
	if (!CreateDirectory(dir_path.c_str(), NULL))
		if (ERROR_ALREADY_EXISTS != GetLastError()) {
			cerr << "ERROR: Could not create directory." << endl;
			return false;
		}
	*/


	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored,
	also Specify the file where the match data is stored.*/
	string input_path, output_path, match_path;
	input_path =  "imageMatches/sfm_data.json";
	output_path =  "sfmReconstruction";
	match_path =  "imageMatches";

	//Include the input, match and output files in the parameter lines.
	cout << "here" << endl;
	cout << match_path << endl;
	cout << "done" << endl;
	string parameter_line = "-i " + input_path + " -m " + match_path + " -o " + output_path
	//Set refining intrinsic matrix settings
		+ " -f " + refine_intrinsic;

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

//Generates a color point cloud, uses a boolean to determine if to use the computed robust triangulation data
bool SfmPipeline::computeDataColor(bool robust)
{
	cout << "--------------------------------------" << endl;
	cout << "Beginning Data Color Computation!" << endl;
	cout << "--------------------------------------" << endl;

	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored. */
	string input_path, output_path;
	if (!robust){
	input_path =  "sfmReconstruction/sfm_data.bin";
	output_path =  "sfmReconstruction/sfm_data_color.ply";
	} else {
	input_path =  "sfmReconstruction/robust_fitting.bin";
	output_path =  "sfmReconstruction/sfm_robust_data_color.ply";
	}
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

bool SfmPipeline::computeGlobalSfm()
{
	cout << "--------------------------------------" << endl;
	cout << "Beginning SFM Process!" << endl;
	cout << "--------------------------------------" << endl;

	// Create Directory where the final reconstruction will be stored. (WINDOWS)
	/*string dir_path = getCurrentDir() + "sfmReconstruction\\" + file_name;
	if (!CreateDirectory(dir_path.c_str(), NULL))
		if (ERROR_ALREADY_EXISTS != GetLastError()) {
			cerr << "ERROR: Could not create directory." << endl;
			return false;
		}
	*/



	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored,
	also Specify the file where the match data is stored.*/
	string input_path, output_path, match_path;
	input_path =  "imageMatches/sfm_data.json";
	output_path =  "sfmReconstruction";
	match_path =  "imageMatches";

	//Include the input, match and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -m " + match_path + " -o " + output_path
	//Set refining intrinsic matrix settings
	+ " -f " + refine_intrinsic
	//Set rotation averaging mode
	+" -r " + rotation_averaging
	//Set translation averaging mode
	+ " -t " + translation_averaging;

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_GlobalSfM", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Global SFM Complete!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Global SFM Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}


bool SfmPipeline::computeTriangulation(){
	cout << "--------------------------------------" << endl;
	cout << "Beginning Robust Fitting Process!" << endl;
	cout << "--------------------------------------" << endl;

	/* Specify input files of previous computed step and output files for
	where the newly computed data should be stored,
	also Specify the file where the match data is stored.*/
	string input_path, output_path, match_path;
	input_path =  "sfmReconstruction/sfm_data.bin";
	output_path =  "sfmReconstruction/robust_fitting.bin";
	match_path =  "imageMatches";

	//Include the input, match and output files in the parameter lines.
	string parameter_line = "-i " + input_path + " -m " + match_path + " -o " + output_path +
	" -b " + bundler_use +
	" -r " + residual_threshold;

	//Execute the executable with created parameters.
	bool res = executeExternal("openMVG_main_ComputeStructureFromKnownPoses", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Robust Fitting Complete!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Robust Fitting Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;




}

bool SfmPipeline::convertToMVS(){
	std::string parameter_line = "";

	string input_path, output_path, output_directory;
	input_path =  "sfmReconstruction/robust_fitting.bin";
	output_path =  "MVS_output/scene.mvs";
	output_directory = "MVS_output";


	parameter_line = parameter_line + " -i " + input_path + " -d " + output_directory + " -o "+ output_path;

	bool res = executeExternal("openMVG_main_openMVG2openMVS", parameter_line);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Conversion To MVS file Success!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Conversion To MVS file Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;

}

//Use OpenMVS to generate a dense point cloud
bool SfmPipeline::computeDensecloud(){
	cout << "--------------------------------------" << endl;
	cout << "Beginning Computation of dense Cloud..." << endl;
	cout << "--------------------------------------" << endl;

	string input_path = "";
	input_path = "MVS_output/scene.mvs";

	bool res = executeExternal("../../openMVS/DensifyPointCloud", input_path);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Computation of dense Cloud Success!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Computation of dense Cloud Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

//Use opeenMVS to reconstruct dense point cloud to mesh
bool SfmPipeline::computeReconstruction(){
	cout << "--------------------------------------" << endl;
	cout << "Beginning Mesh Reconstruction..." << endl;
	cout << "--------------------------------------" << endl;

	string input_path, parameter = "";
	input_path = "MVS_output/scene_dense.mvs";
	parameter = input_path + " --export-type obj";
	bool res = executeExternal("../../openMVS/ReconstructMesh", parameter);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Reconstruction Success!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Reconstruction Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;


}

bool SfmPipeline::refineMesh(){
	cout << "--------------------------------------" << endl;
	cout << "Beginning Mesh Refinement..." << endl;
	cout << "--------------------------------------" << endl;

	string input_path, parameter = "";
	input_path = "MVS_output/scene_dense_mesh.mvs";
	parameter = input_path + " --export-type obj --resolution-level 2";
	bool res = executeExternal("../../openMVS/RefineMesh", parameter);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Mesh Refinement Success!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Mesh Refinement Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;
}

bool SfmPipeline::textureMesh(){
	cout << "--------------------------------------" << endl;
	cout << "Beginning Mesh Texturing..." << endl;
	cout << "--------------------------------------" << endl;

	string input_path, parameter = "";
	input_path = "MVS_output/scene_dense_mesh_refine.mvs";
	parameter = input_path + " -o ../../output_obj/"+ file_name +"/"+ file_name + ".obj --export-type obj";
	bool res = executeExternal("../../openMVS/TextureMesh", parameter);
	if (res == 0) {
		cout << "--------------------------------------" << endl;
		cout << "Mesh Texturing Success!" << endl;
		cout << "--------------------------------------" << endl;
	}
	else {
		cout << "--------------------------------------" << endl;
		cout << "Mesh Texturing Failed!" << endl;
		cout << "--------------------------------------" << endl;
	}
	return !res;


}


//Get algorithm type (Incrimental or Global)
std::string SfmPipeline::getMode(){
	return sfm_mode;
}

//Code use to command-line execute external Executables with given parameters.
bool SfmPipeline::executeExternal(string name, string parameters)
{
	//Windows implementation
	/*
	string _name = name + ".exe";
	string _path = getCurrentDir() + "openMVG\\bin\\";
	string cmd = _path + _name + " " + parameters;
	return system(cmd.c_str());
	*/

	//Linux implementation
	string cmd = name + " " + parameters;
	return system(cmd.c_str());
}

//Read the configuration and apply them to the configuration variables
void SfmPipeline::applyConfiguration(std::ifstream* _file)
{
    std::string mode;
    std::string line;
    std::getline(*_file, line);
    std::getline(*_file, line);
		f = Helper::readProperty(line);
    std::getline(*_file, line);
		camera_model = Helper::readProperty(line);
    std::getline(*_file, line);
    std::getline(*_file, line);
    std::getline(*_file, line);
		force_feature = Helper::readProperty(line);
    std::getline(*_file, line);
		describer_method = Helper::readProperty(line);
    std::getline(*_file, line);
		upright = Helper::readProperty(line);
    std::getline(*_file, line);
		describer_quality = Helper::readProperty(line);
    std::getline(*_file, line);
    std::getline(*_file, line);
    std::getline(*_file, line);
		force_matches = Helper::readProperty(line);
    std::getline(*_file, line);
		ratio = Helper::readProperty(line);
    std::getline(*_file, line);
		geometric_model = Helper::readProperty(line);
    std::getline(*_file, line);
		nearest_matching = Helper::readProperty(line);
    std::getline(*_file, line);
    std::getline(*_file, line);
    std::getline(*_file, line);
    mode = line;
		sfm_mode = Helper::readProperty(line);
    std::getline(*_file, line);
    std::getline(*_file, line);
    std::getline(*_file, line);
		bundler_use = Helper::readProperty(line);
		std::getline(*_file, line);
		residual_threshold = Helper::readProperty(line);
		std::getline(*_file, line);
		std::getline(*_file, line);
		std::getline(*_file, line);

    if (mode == "Incrimental") {
				refine_intrinsic = Helper::readProperty(line);
    }
    else {
        std::getline(*_file, line);
        std::getline(*_file, line);
        std::getline(*_file, line);
				rotation_averaging = Helper::readProperty(line);
        std::getline(*_file, line);
				translation_averaging = Helper::readProperty(line);
        std::getline(*_file, line);
				refine_intrinsic = Helper::readProperty(line);
    }
    _file->close();
}
