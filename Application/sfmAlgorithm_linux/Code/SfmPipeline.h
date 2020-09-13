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
	bool computeDataColor();
	bool computeGlobalSfm();


	void setFocalLength(string _f);
	void setCameraModel(string _c);
	void setForceFeature(string in);
	void setDescriberMethod(string in);
	void setUpright(string in);
	void setDescriberQuality(string in);
	void setForceMatchs(string in);
	void setRatio(string in);
	void setGeoModel(string in);
	void setNearestMatching(string in);
	void setSfmMode(string in);
	void setRefineIntrinsic(string in);
	void setRotationAveraging(string in);
	void setTranslationAveraging(string in);
	void applyConfiguration(std::ifstream *_file);
	std::string getMode();

private:
	string getCurrentDir();
	string file_name;
	bool executeExternal(string name, string parameters);

	// Variables to use for a given Intrinsics matrix K or Focal Length in pixels (f)
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


	double x_half = 400;
	double y_half = 225;

};

#endif
