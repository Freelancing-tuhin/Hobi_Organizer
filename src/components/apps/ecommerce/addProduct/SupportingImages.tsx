import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import CardBox from 'src/components/shared/CardBox';

interface SupportingImagesProps {
    supportingImages: string[];
    setSupportingImages: (images: string[]) => void;
}

declare global {
    interface Window {
        cloudinary: any;
    }
}

const SupportingImages = ({ supportingImages, setSupportingImages }: SupportingImagesProps) => {
    const [isWidgetReady, setIsWidgetReady] = useState(false);

    useEffect(() => {
        // Load Cloudinary script if not already loaded
        if (!window.cloudinary) {
            const script = document.createElement('script');
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            script.onload = () => setIsWidgetReady(true);
            document.body.appendChild(script);
        } else {
            setIsWidgetReady(true);
        }
    }, []);

    const handleUpload = () => {
        if (!window.cloudinary) {
            console.error('Cloudinary widget not loaded');
            return;
        }

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: 'diecfwnp9',
                uploadPreset: 'jo9pp2yd',
                sources: ['local', 'url', 'camera'],
                folder: 'campus_highlights',
                cropping: false,
                multiple: true,
                maxFileSize: 15000000,
                maxFiles: 10,
                resourceType: 'image',
                clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
                styles: {
                    palette: {
                        window: '#1e1e2d',
                        windowBorder: '#5d5fef',
                        tabIcon: '#5d5fef',
                        menuIcons: '#5d5fef',
                        textDark: '#000000',
                        textLight: '#ffffff',
                        link: '#5d5fef',
                        action: '#5d5fef',
                        inactiveTabIcon: '#a0a0a0',
                        error: '#f44336',
                        inProgress: '#5d5fef',
                        complete: '#4caf50',
                        sourceBg: '#2d2d3d',
                    },
                },
            },
            (error: any, result: any) => {
                if (!error && result && result.event === 'success') {
                    const secureUrl = result.info.secure_url;
                    setSupportingImages([...supportingImages, secureUrl]);
                }
                if (error) {
                    console.error('Cloudinary upload error:', error);
                }
            }
        );

        widget.open();
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setSupportingImages(supportingImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="mt-6">
            <CardBox>
                <h5 className="card-title mb-4">Supporting Images</h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Upload additional images to showcase your event. These will be displayed in a gallery.
                </p>

                {/* Upload Button */}
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!isWidgetReady}
                    className="w-full flex flex-col items-center justify-center rounded-xl border-[1px] border-dashed border-primary bg-lightprimary hover:bg-primary/10 transition-all duration-300 cursor-pointer py-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                            <Icon
                                icon="solar:gallery-add-bold"
                                height={28}
                                className="text-primary"
                            />
                        </div>
                        <p className="text-sm font-medium text-darklink dark:text-bodytext">
                            Click to upload supporting images
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG, JPEG up to 15MB each (Max 10 images)
                        </p>
                    </div>
                </button>

                {/* Image Preview Grid */}
                {supportingImages.length > 0 && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Uploaded Images ({supportingImages.length})
                            </span>
                            {supportingImages.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setSupportingImages([])}
                                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {supportingImages.map((imageUrl, index) => (
                                <div
                                    key={index}
                                    className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-700"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`Supporting image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                        </button>
                                    </div>
                                    {/* Image number badge */}
                                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-medium">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <small className="text-xs text-darklink dark:text-bodytext text-center block mt-4">
                    These images will be shown in the event gallery. Upload high-quality images for the best presentation.
                </small>
            </CardBox>
        </div>
    );
};

export default SupportingImages;
