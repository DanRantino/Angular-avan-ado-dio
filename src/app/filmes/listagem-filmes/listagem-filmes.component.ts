import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import { FilmesService } from 'src/app/core/filmes.service';
import { ConfigParams } from 'src/app/shared/models/config-params';
import { Filme } from 'src/app/shared/models/filme';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semfoto = '../../assets/images/angular-material-post.png';

  config:ConfigParams = {
    pagina:0,
    limite:4
  };

  filmes:Filme[]=[];
  filtrosListagem:FormGroup;
  generos:Array<string>;

  constructor(private filmesService: FilmesService,
              private fb:FormBuilder,
              private router: Router) { }

  ngOnInit():void {
    this.filtrosListagem = this.fb.group({
      texto:[''],
      genero:['']
    });

    this.filtrosListagem.get('texto').valueChanges
      .pipe(debounceTime(400))
      .subscribe((data:string) =>{
      this.config.pesquisa = data;
      this.resetarConsultas();
    })

    this.filtrosListagem.get('genero').valueChanges.subscribe((data:string) =>{
      this.config.campo = {tipo: 'genero',valor: data};
      this.resetarConsultas();
    })

    this.generos = [
      'Ação','Romance','Aventura',
      'Terror','Ficção Cinetífica'
      ,'Comédia','Drama',
    ]

    this.listaFilmes();
  }

  onScroll():void {
    this.listaFilmes();
  }

  abrir(id:number):void {
    this.router.navigateByUrl('/filmes/' + id);

  }
  private listaFilmes():void
  {
    this.config.pagina++;
    this.filmesService.listaTodos(this.config).subscribe((filmes:Filme[]) =>
    {
      this.filmes.push(...filmes);
    });
  }

  private resetarConsultas():void{
    this.config.pagina=0;
    this.filmes=[];
    this.listaFilmes();
  }

}
