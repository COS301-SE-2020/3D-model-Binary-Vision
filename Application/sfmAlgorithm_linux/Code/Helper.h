//Author: Quinn du Piesanie
#ifndef _HELPER_
#define _HELPER_

#include <iostream>
#include <fstream>
#include <bits/stdc++.h>
#include <sys/stat.h>
#include <sys/types.h>
class Helper {
public:
	static bool fileExists(std::string file_name);
	static void createPropertyTemplate(std::string file_name);
	static std::string readProperty(std::string _line);
	static bool createDirectory(std::string path);
	static bool directoryExist(std::string path);
private:
	Helper() {}




};

#endif
