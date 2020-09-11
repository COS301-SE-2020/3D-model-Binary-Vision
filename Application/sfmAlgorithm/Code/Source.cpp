// Created by: Quinn du Piesanie
// Pipeline is initialised and used to perform SFM reconstruction here
#include "sfmPipeline.h"

int main() {
	
	cout << "Running..." << endl;

	//Pipeline object that takes in folder name of images to be reconstructed
	SfmPipeline sfm("sample_test");

	// Steps of the SFM reconstruction process:

	// 1 -> Intrinsics Analysis
	if (!sfm.createImageListings()) return 1;

	// 2 -> Feature Computation
	if (!sfm.computeFeatures()) return 1;

	// 3 -> Compute Matches
	if (!sfm.computeMatches()) return 1;
	
	// 4 -> Perform SFM reconstruction
	if (!sfm.computeIncrementalSfm()) return 1;

	// 5 -> Colorise the point cloud
	if (!sfm.computeDataColor()) return 1;

	// TODO
	// Junk removal algorithm
	// 6 -> Triangulation
	// 7 -> Export STL format
	
	cout << "End of computation." << endl;

	return 0;

}