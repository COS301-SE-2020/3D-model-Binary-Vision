#pragma once
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/calib3d.hpp>
#include <iostream>

using namespace cv;
using namespace std;

class CameraCalibration {
	public:
		CameraCalibration();
		void freshCalibration();
		void setChessboardCorners(int horizontal, int vertical);
		void setCameraAspect(int x, int y);
	private:
		int getSquares();
		int window_width = 600;
		int window_height = 600;
		int horizontal_corners = 9;
		int vertical_corners = 6;
		int aspect_x = 1;
		int aspect_y = 1;
		vector<vector<Point3f>> object_points;
		vector<vector<Point2f>> image_points;
		vector<Point2f> corners;
		Mat intrinsic_matrix = Mat(3, 3, CV_32FC1);
		Mat distortion_coefficients;
		vector<Mat> rotation_vectors;
		vector<Mat> translation_vectors;
};