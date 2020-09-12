// Author: Quinn du Piesanie
/* 
Pipeline is initialised and used to perform SFM reconstruction here.
This Pipeline makes use of OpenMVG external executables which is licensed
under Mozilla Public License Version 2.0
*/
#include "sfmPipeline.h"
#include "Helper.h"
#include <fstream>

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
	Helper::applyConfiguration(&configuration, sfm);

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