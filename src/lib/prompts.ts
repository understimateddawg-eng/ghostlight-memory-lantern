/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GenerationMode, GenerationTone, GenerationLanguage, GenerationLength, MemoryDraft } from '../types/memory';

interface PromptContext {
  draft: MemoryDraft;
}

export function buildSystemPrompt(mode: GenerationMode, tone: GenerationTone, lang: GenerationLanguage): string {
  const isSpanish = lang === 'es';

  const baseRules = isSpanish
    ? `Eres el Guardián de la Linterna de Ghostlight, una ofrenda digital y santuario de memoria personal.
Tu misión es honrar las historias y recuerdos humanos con profunda dignidad, belleza y calidez.

REGLAS CRÍTICAS DE ÉTICA Y PRECISIÓN:
1. NUNCA inventes hechos personales que el usuario no haya proporcionado (fechas de nacimiento, nombres de familiares no mencionados, anécdotas no relatadas).
2. NUNCA pretendas canalizar o personificar a un difunto como si estuviera hablando directamente desde el más allá. Si es una carta, escríbela SIEMPRE desde la perspectiva de quien recuerda (el usuario) hacia su ser querido.
3. NUNCA afirmes tener contacto con espíritus reales ni que este texto sea evidencia sobrenatural.
4. Si el modo es una historia ficticia ("A Whisper After Midnight"), la atmósfera mágica o de misterio es ficción poética y debe celebrarse como relato atmosférico, sin atribuir hechos falsos a la vida real de la persona.
5. Evita clichés de inteligencia artificial, frases vacías y rellenos mecánicos. Escribe con prosa o verso sincero, humano y conmovedor.`
    : `You are the Keeper of the Ghostlight Memory Lantern, an intimate digital ofrenda and remembrance sanctuary.
Your mission is to honor human memories, loved ones, and personal stories with deep dignity, literary grace, and warmth.

CRITICAL ETHICAL AND ACCURACY RULES:
1. NEVER fabricate personal facts, biographical details, dates, family relationships, or quotations that the user did not supply.
2. NEVER pretend to channel, possess, or impersonate a deceased person as if they are actively communicating from beyond. If writing a remembrance letter, write STRICTLY from the perspective of the person remembering (the user) addressing their cherished loved one.
3. NEVER claim to contact real spirits or present supernatural fiction as factual evidence.
4. For fictional ghost stories ("A Whisper After Midnight"), the mysterious, shadowy atmosphere is gentle folklore and poetic fiction; never present fictional ghost elements as factual events from the real person's life.
5. Avoid generic AI filler, superficial platitudes, and mechanical phrases. Craft genuine, emotionally resonant prose or verse.`;

  const toneInstructions = {
    tender: isSpanish
      ? 'Tono: Tierno, íntimo, sereno y reconfortante.'
      : 'Tone: Tender, intimate, serene, and comforting.',
    poetic: isSpanish
      ? 'Tono: Poético, lírico, lleno de metáforas visuales de luz, velas y cempasúchil.'
      : 'Tone: Poetic, lyrical, rich with visual imagery of candlelight, marigolds, and quiet reverence.',
    hopeful: isSpanish
      ? 'Tono: Esperanzador, celebrando la vida, la alegría compartida y la gratitud.'
      : 'Tone: Hopeful, celebratory of life, shared laughter, and enduring gratitude.',
    folklore: isSpanish
      ? 'Tono: Folclórico tradicional, inspirado en la reverencia del Día de los Muertos y los caminos de flores.'
      : 'Tone: Traditional folklore, inspired by Día de los Muertos reverence, warm kitchens, and petal pathways.',
    'gently-spooky': isSpanish
      ? 'Tono: Suavemente misterioso, otoñal, como una historia contada a la luz de una vela mientras el viento susurra en las ventanas.'
      : 'Tone: Gently spooky, autumnal, like a story whispered beside candle flame while autumn wind taps at the windowpane.',
  }[tone];

  return `${baseRules}\n\n${toneInstructions}`;
}

export function buildUserPrompt(context: PromptContext): string {
  const { draft } = context;
  const isSpanish = draft.language === 'es';

  const modeDescriptions: Record<GenerationMode, string> = {
    tribute: isSpanish
      ? 'MODO: "A Light of Remembrance" — Un tributo conmemorativo conmovedor que honra las cualidades y recuerdos compartidos.'
      : 'MODE: "A Light of Remembrance" — A heartfelt memorial tribute honoring their remembered qualities, warmth, and specific details.',
    letter: isSpanish
      ? 'MODO: "A Letter to Remember" — Una carta reflexiva escrita desde mi perspectiva (quien recuerda) dirigida a mi ser querido, recordándole con amor y gratitud.'
      : 'MODE: "A Letter to Remember" — A reflective remembrance letter written from my perspective (the living writer) addressing my loved one with heartfelt gratitude and vivid memories.',
    poem: isSpanish
      ? 'MODO: "A Marigold Poem" — Un poema lírico y evocador que entrelaza los recuerdos, lugares, aromas, comidas y tradiciones como imágenes poéticas.'
      : 'MODE: "A Marigold Poem" — An evocative, lyrical poem weaving their favorite places, songs, scents, and traditions into imagery of marigolds, candles, and remembrance.',
    story: isSpanish
      ? 'MODO: "A Whisper After Midnight" — Un relato ficticio y atmosférico suavemente otoñal o sobrenatural, donde una vela encendida trae recuerdos acogedores entre las sombras de una noche silenciosa.'
      : 'MODE: "A Whisper After Midnight" — An atmospheric, gently spooky fictional tale where a lit candle and autumn midnight reveal the warm echoes of their presence in a quiet old house.',
  };

  const lengthInstructions: Record<GenerationLength, string> = {
    short: isSpanish
      ? 'Extensión: Breve y concisa (alrededor de 120-180 palabras).'
      : 'Length: Short and focused (around 120-180 words).',
    medium: isSpanish
      ? 'Extensión: Moderada, equilibrada y detallada (alrededor de 220-320 palabras).'
      : 'Length: Balanced and richly detailed (around 220-320 words).',
    long: isSpanish
      ? 'Extensión: Amplia y desarrollada en varios párrafos o estrofas (alrededor de 380-500 palabras).'
      : 'Length: Expansive and immersive in multiple paragraphs or stanzas (around 380-500 words).',
  };

  let detailsText = '';
  if (draft.relationship) detailsText += `\n- Relationship: ${draft.relationship}`;
  if (draft.favoriteFood) detailsText += `\n- Favorite food/drink: ${draft.favoriteFood}`;
  if (draft.favoriteSong) detailsText += `\n- Favorite song/melody: ${draft.favoriteSong}`;
  if (draft.favoritePlace) detailsText += `\n- Favorite place: ${draft.favoritePlace}`;
  if (draft.favoriteSaying) detailsText += `\n- Memorable saying: "${draft.favoriteSaying}"`;
  if (draft.memorableHabit) detailsText += `\n- Memorable habit or gesture: ${draft.memorableHabit}`;
  if (draft.tradition) detailsText += `\n- Family tradition: ${draft.tradition}`;
  if (draft.additionalContext) detailsText += `\n- Additional background: ${draft.additionalContext}`;

  if (isSpanish) {
    return `${modeDescriptions[draft.mode]}
${lengthInstructions[draft.length]}

DETALLES PROPORCIONADOS POR QUIEN RECUERDA:
- Nombre o título: ${draft.title}
- Historia principal o recuerdo:
"""
${draft.story}
"""${detailsText}

INSTRUCCIONES FINALES:
Escribe la obra directamente en español. No agregues introducciones como "Aquí tienes tu tributo:". Comienza directamente con el texto conmemorativo.`;
  }

  return `${modeDescriptions[draft.mode]}
${lengthInstructions[draft.length]}

DETAILS PROVIDED BY THE PERSON REMEMBERING:
- Name or Title: ${draft.title}
- Main Memory / Story:
"""
${draft.story}
"""${detailsText}

FINAL INSTRUCTIONS:
Begin immediately with the written tribute, poem, letter, or story. Do not add introductory filler like "Here is your tribute:" or conversational preamble. Honor their story directly.`;
}

/**
 * Deterministic Template Mode Fallback
 * Used when WebGPU is unavailable or the user chooses Template Mode.
 * NEVER falsely advertised as AI output.
 */
export function generateDeterministicTemplate(draft: MemoryDraft): string {
  const isSpanish = draft.language === 'es';
  const name = draft.title || (isSpanish ? 'Un Ser Querido' : 'A Cherished Soul');
  const story = draft.story || (isSpanish ? 'Tus recuerdos perduran en cada rincón.' : 'Your memories endure in every quiet corner.');

  if (isSpanish) {
    switch (draft.mode) {
      case 'letter':
        return `Querido(a) ${name},

Esta noche enciendo esta vela pensando en ti y en cada instante que compartimos.
${story}

${draft.favoritePlace ? `Pienso a menudo en ${draft.favoritePlace}, recordando la paz que encontrábamos allí.` : ''}
${draft.favoriteSong ? `Cuando suena "${draft.favoriteSong}", parece que el tiempo se detuviera para traerte de vuelta.` : ''}
${draft.favoriteFood ? `Aún busco el aroma de ${draft.favoriteFood}, ese sabor que convertía cualquier día en celebración.` : ''}
${draft.favoriteSaying ? `Tus palabras siguen guiándome: "${draft.favoriteSaying}".` : ''}
${draft.tradition ? `Mantendremos viva la tradición de ${draft.tradition}, como prometimos.` : ''}

Gracias por el amor que dejaste grabado en nuestras vidas. Mientras mantengamos encendida tu historia, nunca habrá olvido.

Con cariño inalterable,
Quien guarda tu luz`;

      case 'poem':
        return `Sobre el camino de cempasúchil dorado,
una llama tiembla en la suave penumbra.
Por ${name}, cuyo nombre el viento nombra,
en un rincón de amor y paz guardado.

${story}

${draft.favoriteFood ? `Aromas de ${draft.favoriteFood} en la mesa fría,` : 'Un aroma dulce en la mesa serena,'}
${draft.favoriteSong ? `y el eco lejano de "${draft.favoriteSong}" que resuena,` : 'mientras la música del ayer despierta,'}
${draft.favoritePlace ? `la brisa que vuelve de ${draft.favoritePlace},` : 'en cada sendero que la luz consuela,'}
${draft.favoriteSaying ? `repitiendo en susurro: "${draft.favoriteSaying}".` : 'donde el amor sincero nunca muere.'}

Que la linterna arda en la noche quieta:
cada memoria es una estrella que no cesa.`;

      case 'story':
        return `El reloj de la sala marcaba los minutos tras la medianoche cuando la flama de la vela titiló con suavidad.
En el silencio de la casa, el recuerdo de ${name} se sintió tan claro como si el tiempo hubiera abierto una puerta secreta.

${story}

${draft.favoritePlace ? `Por un instante, pareció percibirse el aire fresco de ${draft.favoritePlace}.` : ''}
${draft.favoriteSong ? `En la lejanía de la noche, una melodía semejante a "${draft.favoriteSong}" parecía mecer las cortinas.` : ''}
${draft.favoriteSaying ? `Un susurro familiar recorrió los pensamientos: "${draft.favoriteSaying}".` : ''}

No había temor en aquella penumbra otoñal, sólo la cálida certeza de que quienes amamos jamás se alejan del todo: habitan en la lumbre de las historias que seguimos contando.`;

      case 'tribute':
      default:
        return `En el santuario de Ghostlight, honramos la memoria luminosa de ${name}.

${story}

${draft.relationship ? `Recordado(a) con entrañable devoción como ${draft.relationship}.` : ''}
${draft.favoriteFood ? `Celebramos los sabores que alegraban sus días, en especial ${draft.favoriteFood}.` : ''}
${draft.favoriteSong ? `Su espíritu resonaba en las notas de "${draft.favoriteSong}".` : ''}
${draft.favoritePlace ? `Su corazón hallaba reposo en ${draft.favoritePlace}.` : ''}
${draft.favoriteSaying ? `Guardamos como tesoro su enseñanza: "${draft.favoriteSaying}".` : ''}
${draft.tradition ? `Continuamos honrando la tradición familiar: ${draft.tradition}.` : ''}

Cada historia deja una luz. Que esta llama permanezca como testimonio del amor, la alegría y la huella indeleble que ${name} dejó en nuestro mundo.`;
    }
  }

  // English deterministic templates
  switch (draft.mode) {
    case 'letter':
      return `Dear ${name},

Tonight, as I light this memory lantern, my thoughts turn gently toward you and the quiet gifts you gave to the world.
${story}

${draft.favoritePlace ? `I often think of ${draft.favoritePlace}, where the light seemed to linger just for you.` : ''}
${draft.favoriteSong ? `Whenever "${draft.favoriteSong}" plays, it is as though the distance between then and now disappears.` : ''}
${draft.favoriteFood ? `The comfort of ${draft.favoriteFood} still carries the warmth of your kitchen and shared laughter.` : ''}
${draft.favoriteSaying ? `I still hear your gentle counsel in difficult hours: "${draft.favoriteSaying}".` : ''}
${draft.tradition ? `We will carry forward the tradition of ${draft.tradition}, holding it close for generations to come.` : ''}

Thank you for the kindness, the laughter, and the steady love you wove into my life. As long as we tell your story, your light will never go out.

With enduring love and remembrance,
From the heart that holds your lantern`;

    case 'poem':
      return `Along the path of marigold gold,
A slender beeswax taper glows.
For ${name}, whose story is gently told,
In petals that November knows.

${story}

${draft.favoriteFood ? `A sweet remembrance of ${draft.favoriteFood} on the sill,` : 'An offering placed upon the cedar sill,'}
${draft.favoriteSong ? `The distant melody of "${draft.favoriteSong}" playing still,` : 'A soft refrain across the autumn chill,'}
${draft.favoritePlace ? `The evening wind from ${draft.favoritePlace} returns to bless,` : 'The quiet winds of home return to bless,'}
${draft.favoriteSaying ? `Echoing: "${draft.favoriteSaying}" with tenderness.` : 'Each tender word that time cannot suppress.'}

No shadow lingers where true love was known;
The lantern burns, and you are not alone.`;

    case 'story':
      return `Past midnight, the old house settled into a cathedral of quiet. On the wooden table, the lantern flame curved gracefully, casting warm amber ripples against the darkened walls. It was in this hush that the presence of ${name} felt near—not as a ghost of grief, but as an affectionate memory waking from slumber.

${story}

${draft.favoritePlace ? `A breeze carried the distinct scent of autumn air from ${draft.favoritePlace}, rustling the lace curtains.` : ''}
${draft.favoriteSong ? `From somewhere down the empty corridor, the subtle rhythm of "${draft.favoriteSong}" seemed to echo like an old music box.` : ''}
${draft.favoriteSaying ? `And in the stillness of the mind, familiar words rose clear as day: "${draft.favoriteSaying}".` : ''}

There was no chill in the midnight hour—only the soothing understanding that the people who shape us never truly depart; they remain woven into the wood, the candlelight, and the stories we keep alive.`;

    case 'tribute':
    default:
      return `In the sanctuary of Ghostlight, we celebrate and preserve the cherished memory of ${name}.

${story}

${draft.relationship ? `Remembered with deep devotion and gratitude as ${draft.relationship}.` : ''}
${draft.favoriteFood ? `We celebrate the simple joys that brought a smile, especially ${draft.favoriteFood}.` : ''}
${draft.favoriteSong ? `Their spirit echoes in the melodies of "${draft.favoriteSong}".` : ''}
${draft.favoritePlace ? `A soul deeply anchored in the beauty of ${draft.favoritePlace}.` : ''}
${draft.favoriteSaying ? `We hold close the wisdom of their words: "${draft.favoriteSaying}".` : ''}
${draft.tradition ? `We keep alive the cherished tradition: ${draft.tradition}.` : ''}

Every story leaves a light. May this remembrance flame stand as a living testament to the goodness, character, and enduring love that ${name} brought to all who knew them.`;
  }
}
