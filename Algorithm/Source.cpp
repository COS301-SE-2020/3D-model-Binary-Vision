#define CERES_FOUND TRUE
#include "cameraCalibration.h"
#include <cstdio>
#include <opencv2/sfm.hpp>
#include <opencv2/sfm/reconstruct.hpp>
#include <opencv2/viz.hpp>
#include <fstream>
using namespace cv::sfm;



int main()
{
	//CameraCalibration calib;
	//calib.freshCalibration();
	cout << "End of Execution. " << endl;

	cout << "beggining reconstruction!" << endl;
	vector<Mat> Rs_est, ts_est, points3d_estimated;
	Matx33d K =Matx33d(800, 0, 400,
						0.0, 800, 225,
						0.0, 0.0, 1.0);

	//K = calib.getIntrinsicMatrix();

	
	vector<cv::String> images_paths;
	glob("sample_images/*.png", images_paths, false);


	reconstruct(images_paths, Rs_est, ts_est, K, points3d_estimated, true);

	viz::Viz3d window("Coordinate Frame");
	window.setWindowSize(Size(500, 500));
	window.setWindowPosition(Point(150, 150));
	window.setBackgroundColor(); // black by default


	cout << "Recovering points  ... ";
	// recover estimated points3d
	vector<Vec3f> point_cloud_est;
	for (int i = 0; i < points3d_estimated.size(); ++i)
		point_cloud_est.push_back(Vec3f(points3d_estimated[i]));
	cout << "[DONE]" << endl;


	cout << "Recovering cameras ... ";
	vector<Affine3d> path;
	for (size_t i = 0; i < Rs_est.size(); ++i)
		path.push_back(Affine3d(Rs_est[i], ts_est[i]));
	cout << "[DONE]" << endl;



	if (point_cloud_est.size() > 0)
	{
		cout << "Rendering points   ... ";
		viz::WCloud cloud_widget(point_cloud_est, viz::Color::green());
		window.showWidget("point_cloud", cloud_widget);
		cout << "[DONE]" << endl;
	}
	else
	{
		cout << "Cannot render points: Empty pointcloud" << endl;
	}

	if (path.size() > 0)
	{
		cout << "Rendering Cameras  ... ";
		window.showWidget("cameras_frames_and_lines", viz::WTrajectory(path, viz::WTrajectory::BOTH, 0.1, viz::Color::green()));
		window.showWidget("cameras_frustums", viz::WTrajectoryFrustums(path, K, 0.1, viz::Color::yellow()));
		window.setViewerPose(path[0]);
		cout << "[DONE]" << endl;
	}
	else
	{
		cout << "Cannot render the cameras: Empty path" << endl;
	}
	cout << endl << "Press 'q' to close each windows ... " << endl;
	window.spin();
	return 0;

	return 0;
}