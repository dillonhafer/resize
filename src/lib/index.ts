// place files you want to import through the `$lib` alias in this folder.
import pica from 'pica';

export interface BlobItem {
	filename: string;
	file: Blob;
}

let errorShown = false;

export function resizeImage(
	templateOption: TemplateItem,
	container: HTMLDivElement,
	img: HTMLImageElement,
	blobContainer: BlobItem[]
) {
	let intrinsicSize = Number(templateOption.filename.split('-')[0]);
	Number.isNaN(intrinsicSize) && (intrinsicSize = 1024);

	const size = Number(templateOption.size.split('x')[0]);
	const newImage = document.createElement('img') as HTMLImageElement;
	newImage.style.width = `${size}px`;
	newImage.style.height = `${size}px;`;

	newImage.classList.add('border', 'rounded-lg', 'm-2');
	newImage.title = `${intrinsicSize}x${intrinsicSize} @ ${size}`;
	if (size === 1024) {
		newImage.style.width = `${size / 2}px`;
		newImage.style.height = `${size / 2}px;`;
		newImage.classList.add('col-span-6');
	}

	const outputCanvas = document.createElement('canvas');
	outputCanvas.width = intrinsicSize;
	outputCanvas.height = intrinsicSize;
	return pica()
		.resize(img, outputCanvas)
		.then((result) => pica().toBlob(result, 'image/png', 1))
		.then((blob) => {
			blobContainer.push({ filename: templateOption.filename, file: blob });
			const urlCreator = window.URL || window.webkitURL;
			newImage.src = urlCreator.createObjectURL(blob);
			container.appendChild(newImage);
		})
		.catch((err) => {
			if (!errorShown) {
				errorShown = true;
				alert(err);
			}
		});
}

type Theme = 'any' | 'dark' | 'tinted';
export interface TemplateItem {
	filename: string;
	idiom: string;
	platform: string;
	scale?: string;
	size: string;
	appearances?: Array<{ appearance: string; value: string }>;
}
export const templateJson = (theme: Theme) => {
	const appearance =
		theme === 'any'
			? {}
			: {
					appearances: [
						{
							appearance: 'luminosity',
							value: `${theme}`
						}
					]
				};

	return [
		{
			...appearance,
			filename: `40-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '20x20'
		},
		{
			...appearance,
			filename: `60-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '20x20'
		},
		{
			...appearance,
			filename: `58-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '29x29'
		},
		{
			...appearance,
			filename: `87-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '29x29'
		},
		{
			...appearance,
			filename: `76-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '38x38'
		},
		{
			...appearance,
			filename: `114-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '38x38'
		},
		{
			...appearance,
			filename: `80-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '40x40'
		},
		{
			...appearance,
			filename: `120-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '40x40'
		},
		{
			...appearance,
			filename: `120-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '60x60'
		},
		{
			...appearance,
			filename: `180-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '60x60'
		},
		{
			...appearance,
			filename: `128-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '64x64'
		},
		{
			...appearance,
			filename: `192-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '3x',
			size: '64x64'
		},
		{
			...appearance,
			filename: `136-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '68x68'
		},
		{
			...appearance,
			filename: `152-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '76x76'
		},
		{
			...appearance,
			filename: `167-${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			scale: '2x',
			size: '83.5x83.5'
		},
		{
			...appearance,
			filename: `${theme}.png`,
			idiom: 'universal',
			platform: 'ios',
			size: '1024x1024'
		}
	];
};
