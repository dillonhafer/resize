<script lang="ts">
	import { resizeImage, templateJson, type BlobItem, type TemplateItem } from '$lib';
	import JSZip from 'jszip';
	import { onMount } from 'svelte';

	let anyBlobs: BlobItem[] = [];
	let darkBlobs: BlobItem[] = [];
	let tintedBlobs: BlobItem[] = [];

	let anyContainer: HTMLDivElement;
	let darkContainer: HTMLDivElement;
	let tintedContainer: HTMLDivElement;

	let downloadButton: HTMLButtonElement;

	const anyTemplate = templateJson('any');
	const darkTemplate = templateJson('dark');
	const tintedTemplate = templateJson('tinted');

	const contents = {
		images: anyTemplate.concat(darkTemplate).concat(tintedTemplate),
		info: {
			author: 'xcode',
			version: 1
		}
	};

	const contentsJSON = JSON.stringify(contents, null, 2);
	let jsonDisplay: HTMLPreElement;
	let jsonLink: HTMLAnchorElement;

	onMount(() => {
		jsonDisplay.innerText = contentsJSON;
		jsonLink.href = `data:text/plain;charset=utf-8,${encodeURIComponent(contentsJSON)}`;
	});

	function downloadAssets() {
		downloadButton.disabled = true;
		downloadButton.innerText = 'Downloading...';
		const zip = new JSZip();
		const xcassets = zip.folder('Assets.xcassets');
		const iconset = xcassets?.folder('AppIcon.appiconset');
		iconset?.file('Contents.json', contentsJSON);

		anyBlobs
			.concat(darkBlobs)
			.concat(tintedBlobs)
			.forEach((b) => iconset?.file(b.filename, b.file));

		zip.generateAsync({ type: 'blob' }).then(function (content) {
			const dl = document.createElement('a');
			dl.download = 'Assets.xcassets.zip';
			dl.href = URL.createObjectURL(content);
			dl.classList.add('hidden');
			document.body.appendChild(dl);
			dl.click();
			dl.remove();
			setTimeout(() => {
				downloadButton.innerText = 'Download';
				downloadButton.removeAttribute('disabled');
			}, 2000);
		});
	}

	function onFileSelect(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		const reader = new FileReader();
		const target = input.name;
		let i = setInterval(() => {
			if (anyBlobs.length > 0 && darkBlobs.length > 0 && tintedBlobs.length > 0) {
				downloadButton.removeAttribute('disabled');
				clearInterval(i);
			}
		}, 1000);

		reader.onload = function (e) {
			const image = input.parentElement?.parentElement?.querySelector<HTMLImageElement>('img');
			if (image) {
				// @ts-ignore
				image.src = this.result;
				image.parentElement?.querySelector<HTMLDivElement>('div')?.remove();

				image.onload = () => {
					if (target === 'any') {
						anyBlobs = [];
						anyContainer.innerHTML = '';
						anyTemplate.forEach((v) => {
							resizeImage(v, anyContainer, image, anyBlobs);
						});
					}
					if (target === 'dark') {
						darkBlobs = [];
						darkContainer.innerHTML = '';
						darkTemplate.forEach((v) => {
							resizeImage(v, darkContainer, image, darkBlobs);
						});
					}
					if (target === 'tinted') {
						tintedBlobs = [];
						tintedContainer.innerHTML = '';
						tintedTemplate.forEach((v) => {
							resizeImage(v, tintedContainer, image, tintedBlobs);
						});
					}
				};
			}
		};

		if (file) {
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="border bg-gray-50 shadow">
	<div class="mx-8 max-w-4xl py-8 sm:mx-auto">
		<p class="text-4xl font-semibold">Resize App Icon</p>
		<p class="mb-4">
			Upload all 3 app icons and make sure you use a PNG format that supports transparency with a
			square aspect ratio of 1024x1024 as a minimum.
		</p>

		<details>
			<summary>
				<span class="cursor-pointer text-blue-700 underline hover:text-blue-600 hover:no-underline">
					How to make an icon for dark mode and tinted icons
				</span>
			</summary>

			<p class="mb-4">
				<span class="font-bold"
					>Design your dark and tinted icons to feel at home next to system app icons and widgets.</span
				> You can preserve the color palette of your default icon, but be mindful that dark icons are
				more subdued, and tinted icons are even more so. A great app icon is visible, legible, and recognizable,
				even with a different tint and background.
			</p>

			<p class="mb-4">
				<span class="font-bold"
					>Consider a simplified version of your icon that captures its essential features.</span
				> Because dark and tinted icons appear against a dark background, fine details tend to stand
				out more and can look messy or cluttered.
			</p>

			<p class="mb-4">
				<span class="font-bold">Use your light app icon as a basis for your dark icon.</span> Choose
				complementary colors that reflect the default design, and avoid excessively bright images. To
				look at home on the platform, omit the background so the system-provided background can show
				through.
			</p>

			<div class="mb-4 grid grid-cols-1 sm:grid-cols-3">
				<div class="flex flex-col text-center">
					<p class="text-sm">
						<figure>
							<picture>
								<img
									class="mx-auto"
									decoding="async"
									loading="eager"
									alt="An illustration of a pair of red musical notes against a square transparent background."
									srcset="/music-app-icon-transparent-dark-mode@2x.png 2x"
									src="/music-app-icon-transparent-dark-mode@2x.png"
									data-orientation="square"
									width="132"
									height="auto"
								/>
							</picture>
							<figcaption class="mt-4 text-sm">You provide a transparent dark icon.</figcaption>
						</figure>
					</p>
				</div>
				<div class="flex flex-col text-center">
					<div>
						<p class="text-sm">
							<figure>
								<picture>
									<img
										decoding="async"
										loading="eager"
										class="mx-auto"
										alt="An illustration of a square filled with a gradient of dark gray to black."
										srcset="/music-app-icon-dark-background@2x.png 2x"
										src="/music-app-icon-dark-background@2x.png"
										data-orientation="square"
										width="132"
										height="auto"
									/>
								</picture>
								<figcaption class="mt-4 text-sm">
									The system provides the gradient background.
								</figcaption>
							</figure>
						</p>
					</div>
				</div>
				<div class="flex flex-col text-center">
					<div class="column">
						<p class="text-sm">
							<figure>
								<picture>
									<img
										class="mx-auto"
										decoding="async"
										loading="eager"
										alt="An illustration of a pair of red musical notes against a rounded rectangle background."
										srcset="/music-app-icon-combined-dark-icon@2x.png 2x"
										src="/music-app-icon-combined-dark-icon@2x.png"
										data-orientation="square"
										width="132"
										height="auto"
									/>
								</picture>
								<figcaption class="mt-4 text-sm">
									The system composites your dark icon on the gradient background.
								</figcaption>
							</figure>
						</p>
					</div>
				</div>
			</div>

			<p class="mb-4">
				<span class="font-bold"> Provide your tinted icon as a grayscale image. </span>
				Most app icons look great with a vertical gradient applied uniformly over the icon image.
			</p>

			<div class="mb-4 grid grid-cols-1 sm:grid-cols-3">
				<div class="flex flex-col text-center">
					<p class="text-sm">
						<figure>
							<picture>
								<img
									class="mx-auto"
									decoding="async"
									loading="eager"
									alt="An illustration of a pair of red musical notes against a square transparent background."
									srcset="/music-app-icon-tintable-developer-provided@2x.png 2x"
									src="/music-app-icon-tintable-developer-provided@2x.png"
									data-orientation="square"
									width="132"
									height="auto"
								/>
							</picture>
							<figcaption class="mt-4 text-sm">
								You provide a fully opaque, grayscale icon.
							</figcaption>
						</figure>
					</p>
				</div>
				<div class="flex flex-col text-center">
					<div>
						<p class="text-sm">
							<figure>
								<picture>
									<img
										decoding="async"
										loading="eager"
										class="mx-auto"
										alt="An illustration of a square filled with a gradient of dark gray to black."
										srcset="/music-app-icon-dark-background@2x.png 2x"
										src="/music-app-icon-dark-background@2x.png"
										data-orientation="square"
										width="132"
										height="auto"
									/>
								</picture>
								<figcaption class="mt-4 text-sm">
									The system provides the gradient background.
								</figcaption>
							</figure>
						</p>
					</div>
				</div>
				<div class="flex flex-col text-center">
					<div class="column">
						<p class="text-sm">
							<figure>
								<picture>
									<img
										class="mx-auto"
										decoding="async"
										loading="eager"
										alt="An illustration of a pair of red musical notes against a rounded rectangle background."
										srcset="/music-app-icon-tintable-system-combined-icon@2x.png 2x"
										src="/music-app-icon-tintable-system-combined-icon@2x.png"
										data-orientation="square"
										width="132"
										height="auto"
									/>
								</picture>
								<figcaption class="mt-4 text-sm">
									The system generates a tinted icon, compositing your grayscale icon on the
									gradient background.
								</figcaption>
							</figure>
						</p>
					</div>
				</div>
			</div>
		</details>
	</div>
</div>

<div class="mx-8 max-w-4xl py-8 sm:mx-auto">
	<div class="grid grid-cols-1 sm:grid-cols-3">
		<div>
			<label class="group flex cursor-pointer flex-col items-center justify-center">
				<p class="mb-2">Any</p>
				<div class="relative h-48 w-48">
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGAAAAAEAAGjChXjAAAAAElFTkSuQmCC"
						alt="Placeholder"
						class="absolute inset-0 h-48 w-48 rounded-lg border bg-gray-100 shadow group-hover:bg-gray-200"
					/>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg
							class="size-8 text-gray-600"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
							/>
						</svg>
					</div>
				</div>

				<span class="sr-only">Choose any photo</span>
				<div class="sr-only">
					<input
						on:change={onFileSelect}
						accept="image/png"
						type="file"
						name="any"
						class="block w-full text-sm text-slate-500
        file:mr-4 file:rounded-full file:border-0
        file:bg-blue-50 file:px-4
        file:py-2 file:text-sm
        file:font-semibold file:text-blue-700
        hover:file:bg-blue-100
      "
					/>
				</div>
			</label>
		</div>

		<div>
			<label class="group flex cursor-pointer flex-col items-center justify-center">
				<p class="mb-2">Dark</p>
				<div class="relative h-48 w-48">
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGAAAAAEAAGjChXjAAAAAElFTkSuQmCC"
						alt="Placeholder"
						class="absolute inset-0 h-48 w-48 rounded-lg border bg-gradient-to-b from-slate-700 to-slate-900 shadow group-hover:opacity-60"
					/>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg
							class="size-8 text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
							/>
						</svg>
					</div>
				</div>

				<span class="sr-only">Choose dark photo</span>
				<div class="sr-only">
					<input
						accept="image/png"
						on:change={onFileSelect}
						type="file"
						name="dark"
						class="block w-full text-sm text-slate-500
        file:mr-4 file:rounded-full file:border-0
        file:bg-blue-50 file:px-4
        file:py-2 file:text-sm
        file:font-semibold file:text-blue-700
        hover:file:bg-blue-100
      "
					/>
				</div>
			</label>
		</div>

		<div>
			<label class="group flex cursor-pointer flex-col items-center justify-center">
				<p class="mb-2">Tinted</p>
				<div class="relative h-48 w-48">
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGAAAAAEAAGjChXjAAAAAElFTkSuQmCC"
						alt="Placeholder"
						class="absolute inset-0 h-48 w-48 rounded-lg bg-gray-500 shadow group-hover:bg-gray-600"
					/>
					<div class="absolute inset-0 flex items-center justify-center">
						<svg
							class="size-8 text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
							/>
						</svg>
					</div>
				</div>

				<span class="sr-only">Choose tinted photo</span>
				<div class="sr-only">
					<input
						accept="image/png"
						on:change={onFileSelect}
						type="file"
						name="tinted"
						class="block w-full text-sm text-slate-500
        file:mr-4 file:rounded-full file:border-0
        file:bg-blue-50 file:px-4
        file:py-2 file:text-sm
        file:font-semibold file:text-blue-700
        hover:file:bg-blue-100
      "
					/>
				</div>
			</label>
		</div>
	</div>
</div>

<div class="mx-8 flex max-w-4xl items-center justify-center py-8 sm:mx-auto">
	<button
		bind:this={downloadButton}
		on:click={downloadAssets}
		disabled
		class="mx-8 w-full rounded-lg bg-blue-600 px-8 py-2 text-lg font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:opacity-40 sm:mx-auto sm:w-auto"
		>Download</button
	>
</div>

<div bind:this={anyContainer} class="grid w-full grid-cols-6 bg-gray-400 p-8"></div>

<div bind:this={darkContainer} class="grid w-full grid-cols-6 bg-gray-800 p-8"></div>

<div
	bind:this={tintedContainer}
	class="grid w-full grid-cols-6 bg-gradient-to-r from-gray-800 to-gray-900 p-8"
></div>

<div class="mx-8 max-w-4xl py-8 sm:mx-auto">
	<a bind:this={jsonLink} href="/" download="Contents.json">Contents.json</a>
	<pre bind:this={jsonDisplay} class="overflow-scroll rounded-xl border bg-gray-100 p-2.5"></pre>
</div>
