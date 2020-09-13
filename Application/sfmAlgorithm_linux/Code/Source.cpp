// Author: Quinn du Piesanie
/*
Pipeline is initialised and used to perform SFM reconstruction here.
This Pipeline makes use of OpenMVG external executables which is licensed
under Mozilla Public License Version 2.0
*/
#include "SfmPipeline.h"

int main(int argc, char** argv) {

	cout << "Running..." << endl;

	SfmPipeline* sfm;
	//Pipeline object that takes in folder name of images to be reconstructed
	if (argc > 1) {
		//Set the folder containing images to be read as the first argument
		sfm = new SfmPipeline(argv[1]);
	}
	else {
		//If no arguments were passed used "sample_test" as the folder to be read
		sfm = new SfmPipeline("sample_test");
	}

	//Open configuration file
	if (!Helper::fileExists("pipeline.configuration")) {
		cout << "Could not fine configuration file, creating defualt one..." << endl;
		//Create configuration file if it does not exist
		Helper::createPropertyTemplate("pipeline.configuration");
	}

	//Open configuration file
	ifstream configuration("pipeline.configuration");

	//Apply Configuration Settings to the SFM pipeline
	sfm->applyConfiguration(&configuration);

	//Checks if specific output directories exist.
	if (!Helper::directoryExist("imageData")){
		if (!Helper::createDirectory("imageData")){
			std::cerr << "Could not create directory imageData" << std::endl;
			return 1;
		}
		if (!Helper::createDirectory("imageData/sample_test")){
			std::cerr << "Could not create directory sample_test inside imageData" << std::endl;
			return 1;
		}
		std::cout << "Please insert PNG images into imageData/sample_test to use." << std::endl;
		return 0;
	}

	if (!Helper::directoryExist("imageMatches")){
		if (!Helper::createDirectory("imageMatches")){
			std::cerr << "Could not create directory imageMatches" << std::endl;
			return 1;
		}
	}

	if (!Helper::directoryExist("sfmReconstruction")){
		if (!Helper::createDirectory("sfmReconstruction")){
			std::cerr << "Could not create directory sfmReconstruction" << std::endl;
			return 1;
		}
	}
	// Steps of the SFM reconstruction process:

	// 1 -> Intrinsics Analysis
	if (!sfm->createImageListings()) return 1;

	// 2 -> Feature Computation
	if (!sfm->computeFeatures()) return 1;

	// 3 -> Compute Matches
	if (!sfm->computeMatches()) return 1;

	// 4 -> Perform SFM reconstruction
	string mode = sfm->getMode();
	if (mode == "Incrimental") {
		if (!sfm->computeIncrementalSfm()) return 1;
	}
	else if (mode == "Global") {
		if (!sfm->computeGlobalSfm()) return 1;
	}
	else {
		cout << "Unknown input mode at SFM MODE inside configuration" << endl;
		return 1;
	}

	// 5 -> Colorise the point cloud
	if (!sfm->computeDataColor()) return 1;

	// TODO
	// Junk removal algorithm
	// 6 -> Triangulation
	// 7 -> Export STL format

	cout << "End of computation." << endl;

	return 0;

}
