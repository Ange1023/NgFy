import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserService } from 'src/app/services/user.service';
import { SongService } from 'src/app/services/song.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class SongModalComponent  implements OnInit {

  form = {
    imageURL: "",
    selectedFile: null as File | null,
    songName: '',
    artistName: '',
    durationValue: '',
    selectedCategories: '',
  }

  duration = 0;
  categories: any[] = [];

  constructor(
    private userService: UserService,
    private songService: SongService, 
    private cloudinaryService: CloudinaryService
  ) { }

  ngOnInit() {
    this.userService.userProfile$.subscribe(profile => {
      this.form.artistName = profile!.user.user_name;
    });

    this.songService.getCategoriesSong().subscribe(categories => {
      this.categories = categories.data.categories;
    });
  }

  async selectImageFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });

    if (!file.type.startsWith('image/')) {
      console.error('El archivo seleccionado no es una imagen válida.');
      return;
    }

    this.cloudinaryService.uploadImage(file, 'misc').subscribe({
        next: (res) => {
          this.form.imageURL = res.url;
          console.log('Imagen subida:', this.form.imageURL);
        }, error: (err) => {
          console.error('Error al subir la imagen:', err);
        }
      });
    }

  onAudioSelected(event: any) {
    const file = event.target.files[0];
    this.form.selectedFile = file;
    console.log('Audio seleccionado:', file);

    if (file && file.type.startsWith('audio/')) {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        this.duration = audio.duration;
        this.form.durationValue = this.formatRuntime(this.duration);
      });
    }else{
      console.error('El archivo seleccionado no es un audio válido.');
      this.form.selectedFile = null;
    }
  }
  
  formatRuntime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  onSave() {
    const formData = new FormData();
    formData.append('poster_image', this.form.imageURL); 
    formData.append('title', this.form.songName);
    formData.append('artist', this.form.artistName);
    formData.append('duration', this.duration.toString());
    formData.append('category', this.form.selectedCategories);


    if (this.form.selectedFile) {
      formData.append('file', this.form.selectedFile);
      console.log('Archivo de audio agregado:', this.form.selectedFile);
    }

    this.songService.createSong(formData).subscribe({
      next: (res) => {
        console.log('Canción guardada:', res);
      },
      error: (err) => {
        console.error('Error al guardar la canción:', err);
      }
    });
  }
  isFormValid(): boolean {

    return (
      this.form.songName.trim() !== '' &&
      this.form.artistName.trim() !== '' &&
      this.form.durationValue.trim() !== '' &&
      this.form.imageURL.trim() !== '' &&
      this.form.selectedFile !== null &&
      this.form.selectedCategories.length > 0
    );  
  }


}
