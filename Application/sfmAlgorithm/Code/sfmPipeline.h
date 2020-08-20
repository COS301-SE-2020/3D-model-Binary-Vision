// Created by: Quinn du Piesanie
// Header class to sfmPipeline.cpp
#pragma once
#include <windows.h>
#include <string>
#include <sstream>
#include <iostream>

using namespace std;

class SfmPipeline {

public:
	SfmPipeline(string input_file_name);
	bool createImageListings();
	bool computeFeatures();
	bool computeMatches();
	bool computeIncrementalSfm();
	bool computeDataColor();
private:
	string getCurrentDir();
	string file_name;
	bool executeExternal(string name, string parameters);

	// Variables to use for a given Intrinsics matrix K 
	// TODO solve Intrisic matrix for Intraoral Camera.
	double f = 800;
	double x_half = 400;
	double y_half = 225;

};