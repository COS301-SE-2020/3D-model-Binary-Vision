//Author: Quinn du Piesanie
// Header class to Helper.cpp

#include "Helper.h"

//Checks if file exists under the given name
bool Helper::fileExists(std::string file_name)
{
    std::ifstream f(file_name.c_str());
    return f.good();
}

//Writes default properties to the given file name
void Helper::createPropertyTemplate(std::string file_name)
{
    std::ofstream f(file_name.c_str());
    f << "<-- Image Listing Settings -->\n";
    f << "Focal Length in Pixels: 800 \n";
    f << "Camera Model Type: 3 (1: Pinhole, 2: Pinhole radial 1, 3: Pinhole radial 3) \n \n";
    f << "<-- Compute Feature Settings -->\n";
    f << "Force Recompile: 0 (1: Force Regeneration, 0: Don't Regenerate)\n";
    f << "Describer Method: SIFT (SIFT, AKAZE_FLOAT, AKAZE_MLDB)\n";
    f << "Upright Camera: 0 (0: rotation invariance, 1: Extract upright feature)\n";
    f << "Describer Preset: ULTRA (NORMAL, HIGH, ULTRA) \n \n";
    f << "<-- Compute Feature Matching Settings -->\n";
    f << "Force Recompile: 0 (1: Force Regeneration, 0: Don't Regenerate)\n";
    f << "Ratio: 0.8 (Nearest Neighbour distance ratio)\n";
    f << "Geometric Model: f (Matrix filtering-- f: Fundamental, e: Essential, h: Homography)\n";
    f << "Nearest Matching Method: FASTCASCADEHASHINGL2 (AUTO, BRUTEFORCEL2, ANNL2, CASCADEHASHINGL2, FASTCASCADEHASHINGL2, BRUTEFORCEHAMMING)\n\n";
    f << "<-- SFM METHOD -->\n";
    f << "Mode: Incrimental (Incrimental, Global)\n\n";
    f << "<-- Incrimental Settings -->\n";
    f << "Refined Intrinsics: ADJUST_ALL (ADJUST_ALL, NONE, ADJUST_FOCAL_LENGTH, ADJUST_PRINCIPAL_POINT -- NOTE can be combined with '|')\n\n";
    f << "<-- Global Settings -->\n";
    f << "Rotation Averaging: 2 (1 Method by Chatterjee, 2 Method by Martinec)\n";
    f << "Translation Averaging: 3 (1: averaging, 2: averaging L2, 3: minimization)\n";
    f << "Refined Intrinsics: ADJUST_ALL (ADJUST_ALL, NONE, ADJUST_FOCAL_LENGTH, ADJUST_PRINCIPAL_POINT -- NOTE can be combined with '|')\n";
    f.close();

}

//Creates directory at given path (LINUX)
bool Helper::createDirectory(std::string path)
{
  if (mkdir(path.c_str(), 0777) == -1)
      {
        std::cerr << "Could not create directory :  " << path << std::endl;
        return false;
      }
  else
      {
        std::cout << "Created Directory: " << path << std::endl;
        return true;
      }
}

//Checkes if directory at path exists (LINUX)
bool Helper::directoryExist(std::string path)
{
  struct stat st;
  if(stat(path.c_str(),&st) == 0)
      return true;
  return false;
}


//Reads the first string after ':' in a given line
std::string Helper::readProperty(std::string _line)
{
    std::string output_property = "";
    bool flag = false;
    for (int i = 0; i < _line.length(); i++) {
        if (!flag)
        if (_line.at(i) == ':') {
            flag = true;
            continue;
        }
        else continue;

        if (_line.at(i) == ' ') {
           if (output_property.length() != 0)
            break;
        }
        else {
            output_property += _line.at(i);
        }

    }

    return output_property;
}
