// Author: Quinn du Piesanie
// Header class to sfmPipeline.cpp
#ifndef _SFM_PIPELINE_
#define _SFM_PIPELINE_
#include <string>
#include <sstream>
#include "Helper.h"

using namespace std;

class SfmPipeline {

public:
	SfmPipeline(string input_file_name);
	bool createImageListings();
	bool computeFeatures();
	bool computeMatches();
	bool computeIncrementalSfm();
	bool computeDataColor(bool robust);
	bool computeGlobalSfm();
	bool computeTriangulation();
	bool convertToMVS();
	bool computeDensecloud();
	bool computeReconstruction();
	bool textureMesh();
	bool refineMesh();

	void applyConfiguration(std::ifstream *_file);
	std::string getMode();
	std::string getFileName();
private:
	string file_name;
	bool executeExternal(string name, string parameters);

	// Configuration variables
	string f = "800";
	string camera_model = "3";
	string force_feature = "0";
	string describer_method = "SIFT";
	string upright = "0";
	string describer_quality = "ULTRA";
	string force_matches = "0";
	string ratio = "0.8";
	string geometric_model = "f";
	string nearest_matching = "AUTO";
	string sfm_mode = "Incrimental";
	string refine_intrinsic = "ADJUST_ALL";
	string rotation_averaging = "2";
	string translation_averaging = "3";
	string bundler_use = "ON";
	string residual_threshold = "4.0";

};

#endif
