//Author: Quinn du Piesanie

#pragma once
#include <iostream>
#include <fstream>
#include "sfmPipeline.h"
class Helper {
public:
	static bool fileExists(std::string file_name);
	static void createPropertyTemplate(std::string file_name);
	static std::string readProperty(std::string _line);
	static void applyConfiguration(ifstream *_file, SfmPipeline *obj);
private: 
	Helper() {}




};